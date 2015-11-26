export default function readStream(stream) {
  return new Promise(resolve => {
    const chunks = [];

    stream.setEncoding('utf8');

    stream.on('readable', () => {
      const chunk = stream.read();
      if (chunk !== null) {
        chunks.push(chunk);
      }
    });

    stream.on('end', () => {
      const stdin = chunks.join('');
      resolve(stdin);
    });
  });
}
