enum spaceType{
    none= 'none',
    xxxs= 'xxxs',
    xxs= 'xxs',
    xs= 'xs',
    sm= 'sm',
    md= 'md',
    lg= 'lg',
    xl= 'xl',
    xxl= 'xxl',
    xxxl= 'xxxl',
}

const spaces: {
  none: spaceType.none,
  xxxs: spaceType.xxxs,
    xxs: spaceType.xxs,
    xs: spaceType.xs,
    sm: spaceType.sm,
    md: spaceType.md,
    lg: spaceType.lg,
    xl: spaceType.xl,
    xxl: spaceType.xxl,
    xxxl: spaceType.xxxl,
} = {
    none: spaceType.none,
    xxxs: spaceType.xxxs,
    xxs: spaceType.xxs,
    xs: spaceType.xs,
    sm: spaceType.sm,
    md: spaceType.md,
    lg: spaceType.lg,
    xl: spaceType.xl,
    xxl: spaceType.xxl,
    xxxl: spaceType.xxxl,
}

export default Object.freeze(spaces)
