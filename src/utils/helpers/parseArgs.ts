const parseArgs = () => {
  const args = process.argv.slice(2);

  const result: { [key: string]: string } = {};
  let currentKey: string | null = null;

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      currentKey = arg.slice(2);
      result[currentKey] = 'true';
    } else if (currentKey) {
      result[currentKey] = arg;
      currentKey = null;
    }
  });

  return result;
};

export default parseArgs;
