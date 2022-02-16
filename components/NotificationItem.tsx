import * as React from 'react';
import { Text, Pressable, Spacer, HStack, Switch, Box } from 'native-base';

export function NotificationItem(props: any) {
	const [infoSwitch, setInfoSwitch] = React.useState(props.status);
	const [boxColor, setBoxColor] = React.useState(props.status ? "yellow.300" : "blueGray.800");

	const onSwitchTouch = () => {
		if(infoSwitch) {
			setInfoSwitch(false);
			setBoxColor("blueGray.800");
		}
		else {
			setInfoSwitch(true);
			setBoxColor("yellow.300");
		}
	}
	
  return (
		<Pressable>
			<HStack alignItems="flex-start" mb="8">
				<Text fontSize={14} fontWeight="medium">
					{props.name}
				</Text>
				<Spacer />
				<Box
					mt="-1"
					bg={boxColor}
					rounded="xl"
					overflow="hidden"
					borderColor="muted.500"
					borderWidth="1"
					_web={{
						shadow: 2,
						borderWidth: 0,
					}}>
					{infoSwitch && 
						<Switch
							size="md"
							isChecked={true}
							onTouchEnd={ onSwitchTouch }
							offTrackColor="yellow.300"
							onTrackColor="yellow.300"
							onThumbColor="white"
						/>
					}
					{!infoSwitch && 
						<Switch
							size="md"
							isChecked={false}
							onTouchEnd={ onSwitchTouch }
							offTrackColor="blueGray.800"
							onTrackColor="blueGray.800"
							onThumbColor="white"
						/>
					}
				</Box>
			</HStack>
		</Pressable>
	);
}
