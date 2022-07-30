import React, { useState } from 'react'
import { Descriptions, Badge } from 'antd';

function MovieInfo(props) {

    const { movie } = props;
    
    
    return (
        <Descriptions title="Movie Information" bordered>
        <Descriptions.Item label="Title">{movie.original_title}</Descriptions.Item>
        <Descriptions.Item label="Release Date">{movie.release_date}</Descriptions.Item>
        <Descriptions.Item label="Revenue">{movie.revenue} USD</Descriptions.Item>
        <Descriptions.Item label="Duration">{movie.runtime} Minutes</Descriptions.Item>
        <Descriptions.Item label="Rating" span={2}>
        {props.rating}
        {/* {movie.vote_average} */}
        </Descriptions.Item>
        <Descriptions.Item label="Reviews">
        {props.ratingCount}
        {/* {movie.vote_count} */}
        </Descriptions.Item>
        <Descriptions.Item label="Status">{movie.status}</Descriptions.Item>
        {/* <Descriptions.Item label="Popularity Score">{movie.popularity}</Descriptions.Item> */}
      </Descriptions>
    )
}

export default MovieInfo
