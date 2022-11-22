import React from 'react'
import { Spacing } from '@fanz-project/foundation'

import {ColorProps} from "./types";

const Color: React.FC<ColorProps> = ({ hexCode, width = Spacing.sm, height = Spacing.sm }) => {
    const className = `fanz-width-${width} fanz-height-${height} fanz-margin-md`

    return <div className={className} style={{
        backgroundColor: hexCode,
    }}>

    </div>
}

export default Color
