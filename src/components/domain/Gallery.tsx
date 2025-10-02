'use client'
// Default theme
// import '@splidejs/react-splide/css';

// or other themes
import '@splidejs/react-splide/css/skyblue';
// import '@splidejs/react-splide/css/sea-green';
// or only core styles
//import '@splidejs/react-splide/css/core';
import {Splide, SplideSlide} from '@splidejs/react-splide';
import {Options} from '@splidejs/splide';
import React, {ReactNode} from 'react';
import {Stack} from '@mui/material';
import Image from "next/image";


export class Gallery extends React.Component<{ items: string[] }> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mainRef = React.createRef<Splide>();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  thumbsRef = React.createRef<Splide>();

  /**
   * Set the sync target right after the component is mounted.
   */
  componentDidMount(): void {
    if (this.mainRef.current && this.thumbsRef.current && this.thumbsRef.current.splide) {
      this.mainRef.current.sync(this.thumbsRef.current.splide);
    }
  }

  /**
   * Render slides.
   *
   * @return Slide nodes.
   */
  renderSlides(): ReactNode[] {
    return this.props.items.map(slideSrc => {


      return (
        <SplideSlide key={slideSrc}>
          <Image
            src={slideSrc}
            alt={""}
            fill
            objectFit={"contain"}
          />
        </SplideSlide>
      )
    });
  }

  /**
   * Render the component.
   *
   * @return A React node.
   */
  render(): ReactNode {
    const mainOptions: Options = {
      type: 'loop',
      perPage: 1,
      perMove: 1,
      gap: '24px',
      pagination: false,
      height: '400px',
    };

    const thumbsOptions: Options = {
      type: 'slide',
      rewind: true,
      gap: '12px',
      pagination: false,
      fixedWidth: 110,
      fixedHeight: 70,
      cover: true,
      focus: 'center',
      isNavigation: true,
    };

    return (
      <Stack spacing={3}>
        <Splide
          options={mainOptions}
          ref={this.mainRef}
          aria-labelledby="thumbnail-slider-example"
        >
          {this.renderSlides()}
        </Splide>

        <Splide
          options={thumbsOptions}
          ref={this.thumbsRef}
          aria-label="The carousel with thumbnails. Selecting a thumbnail will change the main carousel"
        >
          {this.renderSlides()}
        </Splide>
      </Stack>
    );
  }
}
