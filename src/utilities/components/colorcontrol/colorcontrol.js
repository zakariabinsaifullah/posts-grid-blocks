import { ColorIndicator, Popover, ColorPicker } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// import style
import './colorcontrol.scss';

const ColorControl = ({ label, value, onChange, enableAlpha }) => {
	const [popOver, setPopOver] = useState(false);
	return (
		<div className="pstgb__color_picker">
			<p className="pstgb__color_picker_label">{label}</p>
			<button
				className="pstgb__color_indicator"
				onClick={() => setPopOver(true)}
			>
				<ColorIndicator colorValue={value} />
			</button>
			{popOver && (
				<Popover
					onFocusOutside={() => setPopOver(false)}
					position="bottom center"
				>
					<div className="pstgb__color_picker_inner">
						<ColorPicker
							color={value}
							onChange={onChange}
							enableAlpha={enableAlpha}
						/>
						<button
							className="pstgb__color_picker_clear"
							onClick={() => onChange('')}
						>
							{__('Clear', 'awesome-logo-carousel-block')}
						</button>
					</div>
				</Popover>
			)}
		</div>
	);
};

export default ColorControl;
