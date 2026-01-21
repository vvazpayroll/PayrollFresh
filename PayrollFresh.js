const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const FICA_RATE = 0.0765;
const OVERTIME_THRESHOLD = 40;

function calculatePayroll(employee) {
    let regularPay = 0;
    let overtimePay = 0;

    if (employee.type === "hourly") {
        if (employee.hoursWorked > OVERTIME_THRESHOLD) {
            regularPay = OVERTIME_THRESHOLD * employee.rate;
            overtimePay = (employee.hoursWorked - OVERTIME_THRESHOLD) * employee.rate * 1.5;
        } else {
            regularPay = employee.hoursWorked * employee.rate;
        }
    } else if (employee.type === "monthly") {
        regularPay = employee.rate;
        overtimePay = 0;
    }

    const grossPay = regularPay + overtimePay;
    const employeeFICA = grossPay * FICA_RATE;
    const employerFICA = grossPay * FICA_RATE;
    const netPay = grossPay - employeeFICA;
    const totalEmployerCost = grossPay + employerFICA;

    return {
        regularPay,
        overtimePay,
        grossPay,
        employeeFICA,
        netPay,
        employerFICA,
        totalEmployerCost
    };
}

async function ask(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function runPayroll() {
    console.log("\n====================================");
    console.log(" PayrollFresh - U.S. Payroll MVP ");
    console.log("====================================\n");

    const employees = [];

    let addMore = true;
    while (addMore) {
        const name = await ask("Employee name: ");
        let type;
        while (true) {
            type = (await ask("Pay type (hourly/monthly): ")).trim().toLowerCase();
            if (type === "hourly" || type === "monthly") break;
            console.log("Invalid input. Please enter 'hourly' or 'monthly'.");
        }

        let rate;
        let hoursWorked = 0;

        if (type === "hourly") {
            while (true) {
                rate = parseFloat(await ask("Hourly rate ($): "));
                if (!isNaN(rate) && rate >= 0) break;
                console.log("Invalid rate. Enter a positive number.");
            }
            while (true) {
                hoursWorked = parseFloat(await ask("Hours worked this week: "));
                if (!isNaN(hoursWorked) && hoursWorked >= 0) break;
                console.log("Invalid hours. Enter a positive number, decimals allowed (e.g., 4.5).");
            }
        } else {
            while (true) {
                rate = parseFloat(await ask("Monthly salary ($): "));
                if (!isNaN(rate) && rate >= 0) break;
                console.log("Invalid salary. Enter a positive number.");
            }
        }

        const employee = { name, type, rate, hoursWorked };
        const result = calculatePayroll(employee);
        employees.push({ ...employee, ...result });

        console.log("\n----------- Payroll Summary -----------");
        console.log(`Employee            : ${name}`);
        console.log(`Regular Pay         : $${result.regularPay.toFixed(2)}`);
        if (type === "hourly") console.log(`Overtime Pay        : $${result.overtimePay.toFixed(2)}`);
        console.log(`Gross Pay           : $${result.grossPay.toFixed(2)}`);
        console.log(`Employee FICA (7.65%): -$${result.employeeFICA.toFixed(2)}`);
        console.log("-------------------------------------");
        console.log(`Net Pay             : $${result.netPay.toFixed(2)}\n`);
        console.log("Employer Payroll Cost:");
        console.log(`Employer FICA (7.65%): $${result.employerFICA.toFixed(2)}`);
        console.log(`Total Employer Cost  : $${result.totalEmployerCost.toFixed(2)}`);
        console.log("-------------------------------------\n");

        let more = await ask("Add another employee? (y/n): ");
        addMore = more.trim().toLowerCase() === "y";
    }

    console.log("\nPayroll processing completed for all employees.");
    rl.close();
}

runPayroll();

