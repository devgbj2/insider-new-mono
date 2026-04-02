// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  // Ganti recommendedTypeChecked ke recommended agar tidak terlalu "rewel" soal tipe
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier, // <--- Taruh paling bawah!
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      // Hapus sourceType: 'commonjs' kecuali kamu memang benar-benar 
      // hanya menulis kode CommonJS murni.
    },
  },
  {
    rules: {
      // Aturan yang bikin hidup lebih tenang
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],

      // Matikan peringatan berlebih
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',

      "prettier/prettier": ["error", { "endOfLine": "auto" }],
    },
  },
);