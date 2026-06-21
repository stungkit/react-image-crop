import { resolve } from 'path'
import { build, defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

function browserCropBundle(): Plugin {
  return {
    name: 'browser-crop-bundle',
    apply: 'build',
    async closeBundle() {
      await build({
        configFile: false,
        build: {
          emptyOutDir: false,
          lib: {
            entry: resolve(__dirname, 'src/addons/browserCrop.ts'),
            name: 'BrowserCrop',
            fileName: 'browserCrop',
          },
        },
        plugins: [
          dts({
            staticImport: true,
            insertTypesEntry: true,
            bundleTypes: true,
          }),
        ],
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // root: './demo',
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactCrop',
      // the proper extensions will be added
      fileName: 'index',
    },
    rolldownOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: chunkInfo => {
          if (chunkInfo.names.includes('index.css')) {
            return 'ReactCrop.css' // For compat with previous versions
          }
          return chunkInfo.names[0]
        },
      },
    },
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
    dts({
      staticImport: true,
      insertTypesEntry: true,
      bundleTypes: true,
    }),
    browserCropBundle(),
  ],
})
