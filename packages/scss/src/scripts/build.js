const Fs = require('fs')
const Path = require('path')
const Sass = require('sass')

const compile = async (path, fileName) => {
    const result = await Sass.compileAsync(path,{
        style:"compressed",
        verbose: true
    })
    await Fs.writeFileSync(
        Path.resolve(fileName),
        await result.css.toString()
    )
}

try {
    (async () => {
        await Fs.promises.mkdir(Path.resolve('dist'), { recursive: true })
        await compile('src/style/style.scss','dist/style.css')
    })()
} catch(e) {
    console.error(e)
}



