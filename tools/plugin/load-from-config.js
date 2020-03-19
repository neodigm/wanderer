const ImageParser = require('./parsers/image')
const MDParser = require('./parsers/md')

const loadPluginsFromConfig = (config) => {
	const pluginPaths = config.plugins || []
	const plugins = []
	for (let pluginPath of pluginPaths) {
		try {
			const PluginClass = require(pluginPath)
			const plugin = new PluginClass()
			if (!plugin.getType || !plugin.getExtensions || !plugin.parse) {
				console.warn(
					'wanderer plugin in path ' + pluginPath + ' was invalid'
				)
				continue
			}
			plugins.push(plugin)
		} catch (e) {
			console.log('Error trying to load plugin at path ' + pluginPath)
			console.log(e)
		}
	}

	// load default plugins
	plugins.push(new ImageParser())
	plugins.push(new MDParser())

	return plugins
}

module.exports = loadPluginsFromConfig
