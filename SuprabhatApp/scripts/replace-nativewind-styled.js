/**
 * jscodeshift transform:
 * - removes `import { styled, createStyled } from 'nativewind'`
 * - removes `const StyledX = styled(View)` declarations
 * - replaces JSX <StyledX ...> with <View ...>
 * - ensures an import from 'react-native' contains needed components
 *
 * Run:
 * npx jscodeshift -t scripts/replace-nativewind-styled.js src --extensions=js,jsx,ts,tsx
 */
module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 1) find and remove import of styled / createStyled from 'nativewind'
  root.find(j.ImportDeclaration, { source: { value: 'nativewind' } })
    .forEach(path => {
      // remove the import declaration
      j(path).remove();
    });

  // 2) find const StyledX = styled(SomeComp) or const StyledX = createStyled(SomeComp)
  const styledDecls = {};
  root.find(j.VariableDeclarator, {
    init: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: (n) => n === 'styled' || n === 'createStyled' }
    }
  }).forEach(path => {
    const id = path.node.id;
    const arg = path.node.init.arguments && path.node.init.arguments[0];
    if (id && id.type === 'Identifier' && arg) {
      let compName = null;
      if (arg.type === 'Identifier') compName = arg.name;
      else if (arg.type === 'MemberExpression') {
        // e.g. ReactNative.Image => fallback to "Image"
        compName = arg.property && arg.property.name;
      }
      if (compName) {
        styledDecls[id.name] = compName;
        // remove the declaration
        const parent = path.parentPath.parent;
        if (parent && parent.type === 'VariableDeclaration') {
          j(parent).remove();
        } else {
          j(path).remove();
        }
      }
    }
  });

  // nothing to do
  if (Object.keys(styledDecls).length === 0) {
    return root.toSource();
  }

  // 3) replace JSXIdentifier usages: <StyledView ...> -> <View ...>
  const styledNames = Object.keys(styledDecls);
  root.find(j.JSXIdentifier)
    .forEach(path => {
      const name = path.node.name;
      if (styledNames.includes(name)) {
        const replacement = styledDecls[name];
        path.replace(j.jsxIdentifier(replacement));
      }
    });

  // also replace MemberExpressions like <StyledFoo.Bar> (rare)
  root.find(j.JSXMemberExpression)
    .forEach(path => {
      // if object is styled alias, replace object with real component name
      if (path.node.object && styledNames.includes(path.node.object.name)) {
        const replacement = styledDecls[path.node.object.name];
        path.replace(j.jsxMemberExpression(j.jsxIdentifier(replacement), path.node.property));
      }
    });

  // 4) ensure import from 'react-native' exists and includes all used components
  const needComponents = new Set(Object.values(styledDecls));

  // find existing react-native import
  const rnImport = root.find(j.ImportDeclaration, { source: { value: 'react-native' } });

  if (rnImport.size() > 0) {
    rnImport.forEach(path => {
      const existing = path.node.specifiers
        .filter(s => s.type === 'ImportSpecifier')
        .map(s => s.imported.name);
      needComponents.forEach(comp => {
        if (!existing.includes(comp)) {
          path.node.specifiers.push(j.importSpecifier(j.identifier(comp)));
        }
      });
    });
  } else {
    // add new import at top
    const firstImport = root.find(j.ImportDeclaration).at(0);
    const specifiers = Array.from(needComponents).map(name => j.importSpecifier(j.identifier(name)));
    const newImport = j.importDeclaration(specifiers, j.literal('react-native'));
    if (firstImport.size() > 0) {
      firstImport.insertBefore(newImport);
    } else {
      root.get().node.program.body.unshift(newImport);
    }
  }

  return root.toSource({ quote: 'single' });
};