const create = (area: string, component: string, state: string) => `${area}-${component}-${state}`;

const storageKeygen = { create };

export default storageKeygen;
