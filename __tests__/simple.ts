import { spawn } from "child_process";
import path from "path";

const doTest = async (file: string, input: string, expectedOutput: string) => {
  const result = new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(__dirname, '..', 'dist', "_test", file), process.cwd()]);
    let receivedData = '';

    child.on('error', (err) => {
      fail(`Child failure: ${err}`);
    });

    child.stdout.on('data', (data) => {
      console.info(`got data: ${data}`);
      receivedData += data.toString();
    });

    child.on('close', (code) => {
      console.info(`got close: ${code}`);
      try {
        expect(code).toBe(0);
        expect(receivedData.toString()).toBe(expectedOutput);
      } catch (e) {
        reject(e);
      }
      resolve(true);
    });

    child.stderr.on('data', (data) => {
      console.info(`log: ${data}`);
    });

    child.stdin.write(input);
    child.stdin.end();
  })

  return result;
}



describe("Simple in, out, and check for concourse resource type", () => {
  it('in works as expected', async () => {
    const result = doTest(
      'simple-in.js',
      `{"source": {"numba": "4"}, "version": {"ref": "5"}}`,
      `{"version":{"ref":"5"},"metadata":[{"name":"numba","value":"4"}]}`,
    )
    expect(result).resolves.toBe(true)
  });

  it('out works as expected', async () => {
    const result = await doTest(
      'simple-out.js',
      `{"source": {"numba":"4"}, "version": {"ref":"1"}}`,
      `{"version":{"ref":"2"}}`,
    )
    expect(result).toBe(true)
  });

  it('check works as expected', async () => {
    const result = await doTest(
      'simple-check.js',
      `{"source": {"numba": "2"}}`,
      `[{"ref":"0"},{"ref":"1"}]`,
    )
    expect(result).toBe(true)
  });

})