import assert from 'node:assert/strict'
import { test } from 'node:test'
import { planResponse } from './responses.ts'

test('realistic responses include quick success, slow success and failure', () => {
  const fast = planResponse('realistic', () => 0)
  const slow = planResponse('realistic', () => 0.7)
  const failure = planResponse('realistic', () => 0.9)
  assert.equal(fast.fail, false)
  assert.ok(fast.delay < 500)
  assert.equal(slow.fail, false)
  assert.ok(slow.delay > 2000)
  assert.equal(failure.fail, true)
})

test('every realistic attempt samples a new outcome, allowing a failed retry', () => {
  const outcomes = [0.9, 0, 0.95, 0, 0.1, 0]
  const random = () => outcomes.shift()
  assert.equal(planResponse('realistic', random).fail, true)
  assert.equal(planResponse('realistic', random).fail, true)
  assert.equal(planResponse('realistic', random).fail, false)
  assert.equal(outcomes.length, 0)
})

test('forced response modes stay consistent across retries', () => {
  for (let attempt = 0; attempt < 4; attempt++) {
    assert.deepEqual(planResponse('fast'), { delay: 180, fail: false })
    assert.deepEqual(planResponse('slow'), { delay: 2800, fail: false })
    assert.deepEqual(planResponse('failure'), { delay: 450, fail: true })
  }
})
