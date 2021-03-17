const { transformCompanyToForm } = require('../transformers');

const companyMock = require('../../../../../../test/unit/data/companies/company-v4')

describe('Company edit details transformer test', () => {



    it('It correctly transforms the company segment details to the form', () => {
        const company = {
            ...companyMock,
        }
    
        const actual = transformCompanyToForm(company);
    
        const expected = {
            
        }

        console.log(actual);
    });
});