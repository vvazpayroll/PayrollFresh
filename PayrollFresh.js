const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function runPayrollMVP() {
    console.log("\n====================================");
    console.log(" PayrollFresh - U.S. Payroll MVP");
    console.log("====================================\n");

    const employeeName = await ask("Employee name: ");

    const hourlyRate = Number(await ask("Hourly rate ($): "));
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
        console.log("Invalid hourly rate.");
        rl.close();
        return;
    }

    const hoursWorked = Number(await ask("Hours worked this week: "));
    if (isNaN(hoursWorked) || hoursWorked < 0) {
        console.log("Invalid hours worked.");
        rl.close();
        return;
    }

    const regularHours = Math.min(hoursWorked, 40);
    const overtimeHours = Math.max(hoursWorked - 40, 0);

    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const grossPay = regularPay + overtimePay;

    const FICA_RATE = 0.0765;

    const employeeFICA = grossPay * FICA_RATE;
    const employerFICA = grossPay * FICA_RATE;

    const netPay = grossPay - employeeFICA;
    const totalEmployerCost = grossPay + employerFICA;

    console.log("\n----------- Payroll Summary -----------");
    console.log(`Employee           : ${employeeName}`);
    console.log(`Regular Pay        : $${regularPay.toFixed(2)}`);
    console.log(`Overtime Pay       : $${overtimePay.toFixed(2)}`);
    console.log(`Gross Pay          : $${grossPay.toFixed(2)}`);
    console.log(`Employee FICA (7.65%): -$${employeeFICA.toFixed(2)}`);
    console.log("-------------------------------------");
    console.log(`Net Pay            : $${netPay.toFixed(2)}\n`);

    console.log("Employer Payroll Cost:");
    console.log(`Employer FICA (7.65%): $${employerFICA.toFixed(2)}`);
    console.log(`Total Employer Cost : $${totalEmployerCost.toFixed(2)}`);
    console.log("-------------------------------------\n");

    rl.close();
}

runPayrollMVP();
