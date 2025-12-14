/**
 * Spouštěcí funkce aplikace.
 * Vygeneruje zaměstnance podle vstupních parametrů a vypočítá statistiky.
 * @param {object} dtoIn - vstupní parametry
 * @param {number} dtoIn.count - počet zaměstnanců k vygenerování
 * @param {number} dtoIn.min - minimální věk zaměstnanců
 * @param {number} dtoIn.max - maximální věk zaměstnanců
 * @returns {object} - objekt obsahující pole employees a statistiky stats
 */
export function main(dtoIn) {
    const employees = generateEmployeeData(dtoIn);
    const stats = getEmployeeStatistics(employees);
    return { employees, stats };
}

/**
 * Generuje náhodná data zaměstnanců.
 * Každý zaměstnanec má jméno, datum narození, věk (float), workload (int) a gender.
 * Věk je vypočítán přesně v intervalu <min, max> pomocí data narození.
 * @param {object} dtoIn - vstupní parametry
 * @param {number} dtoIn.count - počet zaměstnanců k vygenerování
 * @param {number} dtoIn.min - minimální věk zaměstnanců
 * @param {number} dtoIn.max - maximální věk zaměstnanců
 * @returns {Array<object>} - pole zaměstnanců s atributy:
 *   - name {string}
 *   - birthDate {string} (ISO formát)
 *   - age {number} (float, 1 desetinné místo)
 *   - workload {number} (int, 10–50)
 *   - gender {string} ("male" nebo "female")
 */
export function generateEmployeeData(dtoIn) {
    const employees = [];
    const count = dtoIn.count || 10;
    const minAge = dtoIn.min || 18;
    const maxAge = dtoIn.max || 65;

    const now = new Date();
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;

    const maxBirthDate = new Date(now.getTime() - minAge * msPerYear);
    const minBirthDate = new Date(now.getTime() - maxAge * msPerYear);

    for (let i = 0; i < count; i++) {
        const birthTime =
            minBirthDate.getTime() +
            Math.random() * (maxBirthDate.getTime() - minBirthDate.getTime());
        const birthDate = new Date(birthTime);

        const age = (now.getTime() - birthDate.getTime()) / msPerYear;

        employees.push({
            name: `Employee_${i + 1}`,
            birthDate: birthDate.toISOString(),
            age: parseFloat(age.toFixed(1)),
            workload: Math.floor(Math.random() * 41) + 10, 
            gender: Math.random() < 0.5 ? "male" : "female",
        });
    }

    return employees;
}

/**
 * Vypočítá statistiky ze zaměstnanců.
 * Obsahuje total workload, median workload, average age, median age, min/max age a average women workload.
 * @param {Array<object>} employees - pole zaměstnanců
 * @returns {object} - statistiky zaměstnanců
 */
export function getEmployeeStatistics(employees) {
    const workloads = employees.map(e => e.workload);
    const ages = employees.map(e => e.age);
    const women = employees.filter(e => e.gender === "female");

    return {
        total: workloads.reduce((a, b) => a + b, 0),
        medianWorkload: Math.round(median(workloads)),
        averageAge: roundTo1Decimal(average(ages)),
        medianAge: Math.round(median(ages)),
        minAge: Math.round(Math.min(...ages)),
        maxAge: Math.round(Math.max(...ages)),
        averageWomenWorkload: women.length > 0
            ? roundTo1Decimal(average(women.map(w => w.workload)))
            : 0,
    };
}


/**
 * Spočítá průměr hodnot.
 * @param {Array<number>} values - pole čísel
 * @returns {number} - průměr
 */
function average(values) {
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
}

/**
 * Spočítá medián hodnot.
 * @param {Array<number>} values - pole čísel
 * @returns {number} - medián
 */
function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        return sorted[mid];
    }
}

/**
 * Zaokrouhlí číslo na 1 desetinné místo.
 * @param {number} num - číslo
 * @returns {number} - číslo zaokrouhlené na 1 desetinné místo
 */
function roundTo1Decimal(num) {
    return parseFloat(num.toFixed(1));
}