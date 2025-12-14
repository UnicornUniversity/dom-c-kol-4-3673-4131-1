/**
 * Entry point of the application.
 * Generates employees based on input parameters and calculates statistics.
 * @param {object} dtoIn - input parameters
 * @param {number} dtoIn.count - number of employees to generate
 * @param {object} dtoIn.age - age interval
 * @param {number} dtoIn.age.min - minimum age of employees
 * @param {number} dtoIn.age.max - maximum age of employees
 * @returns {object} - object containing employees and statistics
 */
export function main(dtoIn) {
    const employees = generateEmployeeData(dtoIn);
    const stats = getEmployeeStatistics(employees);

    return {
        employees,
        sortedByWorkload: stats.sortedByWorkload,
        ...stats
    };
}

// ---------- Static lists of names and surnames ----------

const names = [
    "James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","William","Elizabeth",
    "David","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen",
    "Christopher","Nancy","Daniel","Lisa","Matthew","Betty","Anthony","Margaret","Mark","Sandra",
    "Paul","Ashley","Steven","Kimberly","Andrew","Emily","Kenneth","Donna","Joshua","Michelle",
    "Kevin","Dorothy","Brian","Carol","George","Amanda","Edward","Melissa","Ronald","Deborah"
];

const surnames = [
    "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
    "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
    "Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson",
    "Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
    "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"
];


/**
 * Generates random employee data.
 * @param {object} dtoIn - input parameters
 * @returns {Array<object>} - array of employees
 */
export function generateEmployeeData(dtoIn) {
    const employees = [];
    const count = dtoIn.count || 10;
    const minAge = dtoIn.age?.min ?? 18;
    const maxAge = dtoIn.age?.max ?? 65;

    // ensure proper interval
    const realMinAge = Math.min(minAge, maxAge);
    const realMaxAge = Math.max(minAge, maxAge);

    const now = new Date();
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;

    const maxBirthDate = new Date(now.getTime() - realMinAge * msPerYear);
    const minBirthDate = new Date(now.getTime() - realMaxAge * msPerYear);

    for (let i = 0; i < count; i++) {
        const birthTime =
            minBirthDate.getTime() +
            Math.random() * (maxBirthDate.getTime() - minBirthDate.getTime());
        const birthDate = new Date(birthTime);
        if (isNaN(birthDate.getTime())) {
            continue; // skip invalid date
        }

        const age = (now.getTime() - birthDate.getTime()) / msPerYear;

        employees.push({
            name: names[Math.floor(Math.random() * names.length)],
            surname: surnames[Math.floor(Math.random() * surnames.length)],
            birthdate: birthDate.toISOString(),
            age: roundTo1Decimal(age),
            workload: (Math.floor(Math.random() * 4) + 1) * 10, // only 10,20,30,40
            gender: Math.random() < 0.5 ? "male" : "female",
        });
    }

    return employees;

}

/**
 * Calculates statistics from employees.
 * @param {Array<object>} employees - array of employees
 * @returns {object} - employee statistics
 */
export function getEmployeeStatistics(employees) {
    const workloads = employees.map(e => e.workload);
    const ages = employees.map(e => e.age);
    const women = employees.filter(e => e.gender === "female");

    // counts of employees by workload
    const workloadCounts = {};
    for (const w of workloads) {
        workloadCounts[`workload${w}`] = (workloadCounts[`workload${w}`] || 0) + 1;
    }

    return {
        count: employees.length, // total number of employees
        medianWorkload: workloads.length > 0 ? median(workloads) : NaN, // median workload
        averageAge: ages.length > 0 ? roundTo1Decimal(average(ages)) : NaN, // average age rounded to 1 decimal
        medianAge: ages.length > 0 ? median(ages) : NaN, // median age
        minAge: ages.length > 0 ? Math.min(...ages) : NaN, // youngest employee
        maxAge: ages.length > 0 ? Math.max(...ages) : NaN, // oldest employee
        averageWomenWorkload: women.length > 0 ? roundTo1Decimal(average(women.map(w => w.workload))) : NaN, // average workload of women
        sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload), // sorted by workload
        ...workloadCounts // number of employees by workload
    };
}
// ---------- Helper functions ----------

/**
 * Calculates average of values.
 * @param {number[]} values - array of numbers
 * @returns {number} - average or NaN if empty
 */
function average(values) {
    if (values.length === 0) return NaN;
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
}

/**
 * Calculates median of values.
 * @param {number[]} values - array of numbers
 * @returns {number} - median or 0 if empty
 */
function median(values) {
    if (values.length === 0) return NaN;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

/**
 * Rounds a number to one decimal place.
 * @param {number} num - number to round
 * @returns {number} - rounded number
 */
function roundTo1Decimal(num) {
    return parseFloat(num.toFixed(1));
}