export const SPACING = ['100', '200', '300', '400', '500'] as const

export type Spacing = (typeof SPACING)[number]
