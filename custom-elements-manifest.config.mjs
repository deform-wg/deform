function deformPublicApiFilterPlugin() {
  const isInternalName = (name) => typeof name === 'string' && name.startsWith('_');

  return {
    name: 'deform-public-api-filter',
    moduleLinkPhase({ moduleDoc }) {
      const classes =
        moduleDoc.declarations?.filter((declaration) => declaration.kind === 'class') ?? [];

      for (const declaration of classes) {
        declaration.members =
          declaration.members?.filter((member) => !isInternalName(member.name)) ?? [];

        declaration.attributes =
          declaration.attributes?.filter(
            (attribute) => !isInternalName(attribute.name) && !isInternalName(attribute.fieldName),
          ) ?? [];
      }
    },
  };
}

export default {
  globs: ['src/de-form.ts'],
  exclude: ['src/__tests__/**', 'form-builder/**'],
  outdir: 'dist',
  litelement: true,
  packagejson: false,
  plugins: [deformPublicApiFilterPlugin()],
};
