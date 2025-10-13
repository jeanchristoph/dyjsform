const timestamp = Date.now();

async function importTemplate(name) {
    return import(`./${name}.js?v=${timestamp}`).then(module => module[name]);
}

const [Classic, Bs5] = await Promise.all([
    importTemplate('Classic'),
    importTemplate('Bs5')
]);

export { Classic, Bs5 };