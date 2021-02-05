import { exists } from '../src/utils'

test('m2i:utils', async () => {
  const result1 = await exists(__dirname)
  expect(result1).toBe('dir')

  const result2 = await exists(__filename)
  expect(result2).toBe('file')

  const result3 = await exists('m2i' + Date.now().toString())
  expect(result3).toBe(false)
})
