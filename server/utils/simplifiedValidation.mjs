/*
Шпаргалка
    email
    length-0-4
    n-empty
    params
    query
    string
    date
    date-between-1900.01.01-now
    int
    boolean
    in-admin-member
*/

const isNotDate = (value) => {
    const date = new Date(value);
    if (isNaN(date.getDate())) throw new Error(`The ${key} is not a date`);
    return true
}

const simplifiedValidation = (validationData) => {
    const simplifiedValidationData = {};
    for (const key in validationData) {
        simplifiedValidationData[key] = {};
        validationData[key].map((value) => {
            if (/^array-.*$/.test(value)) {
                const
                    payload = {},
                    options = value.slice(6).split(","),
                    arrayKey = `${key}.*`;
                payload[arrayKey] = options;
                simplifiedValidationData[arrayKey] = simplifiedValidation(payload)[arrayKey];
                delete simplifiedValidationData[key];
            }
            else if (value == "optional") {
                simplifiedValidationData[key].optional = true
            }
            else if (value == "email") {
                simplifiedValidationData[key].isEmail = {
                    errorMessage: `The ${key} data is not email`
                };
            }
            else if (value == "url") {
                simplifiedValidationData[key].isURL = {
                    errorMessage: `The ${key} data is not url`
                };
            } else if (/^length-\d+-\d+$/.test(value)) {
                const lengthData = value.split("-");
                simplifiedValidationData[key].isLength = {
                    options: { min: lengthData[1], max: lengthData[2] },
                    errorMessage: `The length of ${key} must consist of a minimum of ${lengthData[1]} and a maximum of ${lengthData[2]} characters`
                };
            } else if (value == "n-empty") {
                simplifiedValidationData[key].notEmpty = {
                    errorMessage: `The ${key} should not be empty`
                };
            } else if (value == "params") {
                simplifiedValidationData[key].in = ['params'];
            } else if (value == "query") {
                simplifiedValidationData[key].in = ['query'];
            } else if (value == "string") {
                simplifiedValidationData[key].isString = {
                    errorMessage: `The ${key} is not string`
                };
            } else if (value == "date") {
                simplifiedValidationData[key].custom = { options: isNotDate }
            } else if (/^date-between-.*-.*$/.test(value)) {
                simplifiedValidationData[key].custom = {
                    options: (data) => {
                        const dateData = value.split("-");
                        const dates = [data, dateData[2], dateData[3]];

                        for (let x = 0; x < dates.length; x++) {
                            if (dates[x] == "now") dates[x] = new Date();
                            else dates[x] = new Date(dates[x]);
                        }
                        if (!(dates[1] <= dates[0] && dates[0] <= dates[2])) throw new Error(`The ${key} is not in the selected range`);
                        return true;
                    }
                }
            } else if (/^in-.*$/.test(value)) {
                const isIn = value.slice(3).split("-");
                simplifiedValidationData[key].isIn = {
                    options: [isIn],
                    errorMessage: `${key} is not included in the list`
                };
            } else if (value == "boolean") {
                simplifiedValidationData[key].isBoolean = {
                    errorMessage: `The ${key} is not boolean`
                };
            } else if (value == "int") {
                simplifiedValidationData[key].isInt = {
                    errorMessage: `The ${key} is not integer`
                };
            }

        })
    }
    return simplifiedValidationData;
};

export default simplifiedValidation;