import { spawn } from "child_process";
import path from "path";


describe("Simple in, out, and check for concourse resource type", () => {
  it('in works as expected', async () => {
    const result = new Promise((resolve, reject) => {
      const child = spawn('node', [path.join(__dirname, '..', 'dist', "_test", 'simple-in.js'), process.cwd()]);

      let receivedData = '';

      child.on('error', (err) => {
        fail(`Error: ${err}`);
      });
      child.stdout.on('data', (data) => {
        receivedData += data.toString();
        
      });

      child.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
      });

      child.on('close', (code) => {
        expect(code).toBe(0);
        expect(receivedData.toString()).toBe('{"version":{"ref":"14"},"metadata":[{"name":"woah","value":"dude"}]}');
        resolve(true);
      });

      child.stdin.write(`{"source": {"numba": "4"}, "version": {"ref": "1"}}`);
      child.stdin.end();

    });
    expect(result).resolves.toBe(true)
  });

})