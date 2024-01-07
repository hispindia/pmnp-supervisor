import bindDataContext from './data_context';
import sum from 'lodash/sum';

const familyMemberDeIds = [
    'Eqi1288N8Nd',
    'hx5FKOqT18B',
    'cz6oa275ize',
    'S91BBc2Op9Z',
    'yHQ9LbhuLPh',
    'osp7h6GLyV8',
    'GTEknIuyEiO',
    'y9zGBpMBAhQ',
    'eDwcbrF4Qsr',
    'xllqsmDiexq',
    'DG9EvDsL801',
    'qaAsAc4DBlE',
    'CCtvT9h1yB4',
    'Gf8F7hQqygz',
    'AI5nHnkf5WR',
    'dE6mw0hXdAt',
];

const calculateTotalPopulation = (data) => {
    const dataContext = bindDataContext(data);
    const years = data.metaData.dimensions.pe;
    return years.map((year) => {
        const valueIndex = dataContext.getDataValueIndex('value');
        const peIndex = dataContext.getDataValueIndex('pe');
        const dxIndex = dataContext.getDataValueIndex('dx');

        const rowValues = data.rows
            .filter(
                (row) =>
                    row[peIndex] === year &&
                    familyMemberDeIds.find((deId) =>
                        row[dxIndex].includes(deId)
                    )
            )
            .map((row) => +row[valueIndex]);

        return rowValues && rowValues.length ? sum(rowValues) : 0;
    });
};

export { calculateTotalPopulation };
