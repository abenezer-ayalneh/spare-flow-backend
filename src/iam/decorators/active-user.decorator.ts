import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import REQUEST_USER_KEY from '../iam.constants'
import { ActiveUserData } from '../types/active-user-data.type'

const ActivePlayer = createParamDecorator((field: keyof ActiveUserData | undefined, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest()
	const player: ActiveUserData | undefined = request[REQUEST_USER_KEY]
	return field ? player?.[field] : player
})

export default ActivePlayer
