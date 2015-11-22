export default function readStdin() {
  return new Promise(resolve => {
    const chunks = [];

    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        chunks.push(chunk);
      }
    });

    process.stdin.on('end', () => {
      const stdin = chunks.join('');
      resolve(stdin);
    });
  });
}
