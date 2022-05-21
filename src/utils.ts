export function printDiagnostic(text: string | string[]) {
  if (typeof text === 'string') {
    print(`HammerBar: ${text}`);
  } else {
    print();
    print('HammerBar diagnostic start');
    text.forEach((line) => {
      print(`    ${line}`);
    });
    print('HammerBar diagnostic end');
    print();
  }
}
