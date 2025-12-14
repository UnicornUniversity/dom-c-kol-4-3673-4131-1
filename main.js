  //TODO add imports if needed
//TODO doc
/**
 * The main function which calls the application. 
 * Please, add specific description here for the application purpose.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  //TODO code
  //let dtoOut = exMain(dtoIn);
    const employees = generateEmployeeData(dtoIn);
    const stats = getEmployeeStatistics(employees);
    return { employees, stats };
}

/**
 * Please, add specific description here 
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  //TODO code
  //let dtoOut = exGenerateEmployeeData(dtoIn);
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
   * Calculates statistics from employee data.
   * Includes total workload, median workload, average age, median age, min/max age, and average women workload.
   * @param {Array} employees containing all the mocked employee data
   * @returns {object} statistics of the employees
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


  function average(values) {
      const sum = values.reduce((a, b) => a + b, 0);
      return sum / values.length;
  }

  function median(values) {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
          return (sorted[mid - 1] + sorted[mid]) / 2;
      } else {
          return sorted[mid];
      }
  }

  function roundTo1Decimal(num) {
      return parseFloat(num.toFixed(1));
  }