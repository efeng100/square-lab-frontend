import React from 'react';

// import Carousel from 'react-bootstrap/Carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import { SIZES } from '../constants';

import 'bootstrap/dist/css/bootstrap.min.css';

const GraphCarousel = ({graphs}) => {
	return (
		<Carousel autoPlay={true} emulateTouch infiniteLoop showIndicators={false} swipeable>
			{
				SIZES.map(size => (
					<div>
						<img src={graphs[size]} />
					</div>
				))
			}
		</Carousel>
	);
}

export default GraphCarousel;