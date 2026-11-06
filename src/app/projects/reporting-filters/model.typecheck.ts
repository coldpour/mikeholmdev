import type { Filter } from './model'

// These compile-time checks fail if the union ever becomes permissive again.
export const validText: Filter = {
  type: 'text',
  field: 'name',
  operator: 'includes',
  value: 'recorder'
}
export const validNumber: Filter = {
  type: 'number',
  field: 'dailyRate',
  operator: 'lessThan',
  value: 150
}
export const validDate: Filter = {
  type: 'date',
  field: 'servicedOn',
  operator: 'greaterThan',
  value: '2026-01-01'
}
export const validEnum: Filter = {
  type: 'category',
  field: 'category',
  operator: 'is',
  value: 'Audio'
}
// @ts-expect-error Text cannot be compared with a numeric ordering operator.
export const invalidOperator: Filter = {
  type: 'text',
  field: 'name',
  operator: 'greaterThan',
  value: 'recorder'
}
// @ts-expect-error A numeric field cannot belong to a text condition.
export const invalidField: Filter = {
  type: 'text',
  field: 'dailyRate',
  operator: 'is',
  value: '150'
}
// @ts-expect-error Numbers must remain numbers in applied conditions.
export const invalidValue: Filter = {
  type: 'number',
  field: 'dailyRate',
  operator: 'is',
  value: '150'
}
// @ts-expect-error Categories are a closed set.
export const invalidEnum: Filter = {
  type: 'category',
  field: 'category',
  operator: 'is',
  value: 'Microphone'
}
