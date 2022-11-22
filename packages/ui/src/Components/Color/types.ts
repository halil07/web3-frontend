import {Spacing} from "@fanz-project/foundation";

export interface ColorProps {
    hexCode: string
    width?: keyof typeof Spacing,
    height?: keyof typeof Spacing
}
