// One-off extraction: pull the real jobs[] and companies{} literals out of the
// original WorkHive prototype's component script and turn them into JSON,
// so seed.sql can be generated from real content instead of invented data.
import fs from 'node:fs';
import vm from 'node:vm';

const src = fs.readFileSync('/tmp/workhive_script.js', 'utf8');
const lines = src.split('\n');

// jobs literal: line 295 (0-indexed 294) through line 405 (closing "]," of the array,
// before ".map(j => Object.assign(...))" on line 406)
const jobsLiteral = '[' + lines.slice(294, 405).join('\n') + ']';
const jobs = vm.runInNewContext(jobsLiteral);

// companies literal: line 735 (0-indexed 734) through line 1334 (before closing "};" on 1335)
const companiesLiteral = '(function(){ return {' + lines.slice(734, 1334).join('\n') + '}; })()';
const companies = vm.runInNewContext(companiesLiteral);

fs.writeFileSync('scripts/jobs.json', JSON.stringify(jobs, null, 2));
fs.writeFileSync('scripts/companies.json', JSON.stringify(companies, null, 2));
console.log('jobs:', jobs.length, 'companies:', Object.keys(companies).length);
