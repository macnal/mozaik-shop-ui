'use client'
import '@splidejs/react-splide/css';
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

    componentDidMount(): void {
        if (this.mainRef.current && this.thumbsRef.current && this.thumbsRef.current.splide) {
            this.mainRef.current.sync(this.thumbsRef.current.splide);
        }
    }

    renderSlides(): ReactNode[] {
        return this.props.items.map(slideSrc => {


            return (
                <SplideSlide key={slideSrc}>
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/9', // nowoczesne przeglądarki
                        minHeight: 250,      // zapewnia widoczność na mobile
                        overflow: 'hidden',
                    }}
                    >
                        <Image
                            src={slideSrc}
                            alt={""}
                            fill
                            style={{objectFit: 'contain', objectPosition: 'center'}}
                        />
                    </div>
                </SplideSlide>
            )
        });
    }

    render(): ReactNode {
        const mainOptions: Options = {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            drag: 'free',
            snap: true,
            padding: '3rem',
            rewind: true,
        };

        return (
            <Stack spacing={3}>
                <Splide
                    options={mainOptions}
                    ref={this.mainRef}
                    aria-labelledby="gallery-heading"
                >
                    {this.renderSlides()}
                </Splide>
            </Stack>
        );
    }
}
