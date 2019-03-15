import {
	defaultExternals,
	defaultOutputConfig,
	defaultPlugins,
	defaultProdPlugins,
	defaultServePlugins,
	copy,
	isLibrary,
	isProd,
	isServe,
	workbox
} from "@appnest/web-config";
import {resolve, join} from "path";
import pkg from "./package.json";

const folders = {
	src: resolve(__dirname, "src/demo"),
	dist: resolve(__dirname, "dist"),
	assets: resolve(__dirname, "assets"),
	dist_assets: resolve(__dirname, "dist/assets")
};

const files = {
	main: join(folders.src, "main.ts"),
	src_index: join(folders.src, "index.html"),
	src_robots: join(folders.src, "robots.txt"),
	src_sw_extension: join(folders.src, "sw-extension.js"),
	dist_sw_extension: join(folders.dist, "sw-extension.js"),
	dist_index: join(folders.dist, "index.html"),
	dist_robots: join(folders.dist, "robots.txt"),
	dist_service_worker: join(folders.dist, "sw.js")
};

export default {
	input: {
		main: files.main
	},
	output: [
		defaultOutputConfig({
			format: "esm",
			dir: folders.dist
		})
	],
	plugins: [
		...defaultPlugins({
			cleanerConfig: {
				targets: [
					folders.dist
				]
			},
			copyConfig: {
				resources: [
					[folders.assets, folders.dist_assets]
				]
			},
			htmlTemplateConfig: {
				template: files.src_index,
				target: files.dist_index,
				include: /main(-.*)?\.js$/
			},
			importStylesConfig: {
				globals: ["main.scss"]
			}
		}),

		// Serve
		...(isServe ? [
			...defaultServePlugins({
				serveConfig: {
					port: 1340,
					contentBase: folders.dist
				},
				livereloadConfig: {
					watch: folders.dist,
					port: 35730
				}
			})
		] : []),

		// Production
		...(isProd ? [
			...defaultProdPlugins({
				dist: folders.dist,
				minifyLitHtmlConfig: {
					verbose: false,
					// Exclude all files since we need the original formatting for the demo code blocks
					exclude: /.*/
				},
				visualizerConfig: {
					filename: join(folders.dist, "stats.html")
				},
				licenseConfig: {
					thirdParty: {
						output: join(folders.dist, "licenses.txt")
					}
				}
			}),
			copy({
				resources: [
					[files.src_robots, files.dist_robots],
					[files.src_sw_extension, files.dist_sw_extension],
				]
			}),
			workbox({
				mode: "generateSW",
				workboxConfig: {
					globDirectory: folders.dist,
					swDest: files.dist_service_worker,
					globPatterns: [ `**/*.{js,png,html,css}`],
					importScripts: [`sw-extension.js`]
				}
			})
		] : []),
	],
	external: [
		...(isLibrary ? [
			...defaultExternals(pkg)
		] : [])
	],
	treeshake: isProd,
	context: "window"
}

