import ImportService from './Service/ImportService.js';

const [Classic, Bs5] = await ImportService.importMultiple([
    './Classic.js',
    './Bs5.js',
]);

export { Classic, Bs5 };