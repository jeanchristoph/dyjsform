const timestamp = Date.now();

async function importTemplate(name) {
    return import(`./${name}.js?v=${timestamp}`).then(module => module[name]);
}

const [Classic, Test, Bs5] = await Promise.all([
    importTemplate('Classic'),
    importTemplate('Test'),
    importTemplate('Bs5')
]);

export { Classic, Test, Bs5 };