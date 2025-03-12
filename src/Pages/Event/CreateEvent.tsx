import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  Upload,
  UploadFile,
  Radio,
} from 'antd';
import { dateRulesEvent, nameRules } from '../../ultils/validationRules';
import type { RadioChangeEvent } from 'antd';
import PreviewImageUpload from '../Components/PreviewImageUpload';
import mapboxgl, { MapMouseEvent } from 'mapbox-gl';
import Map, { Marker } from 'react-map-gl/mapbox';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import type {MapRef} from 'react-map-gl/mapbox';

mapboxgl.accessToken =
  'pk.eyJ1Ijoia2hpZW1waGFtIiwiYSI6ImNsam01eHhnaTAyNmczZmxzcnQ1MTVqN3gifQ.WVqIQlSk52FSN8W7G5gsnw';

const { TextArea } = Input;
interface MarkerPosition {
  longitude: number;
  latitude: number;
}

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};
const CreateEvent = () => {
  const mapRef = useRef<MapRef>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [value, setValue] = useState(1);
  const [viewport, setViewport] = useState({
    latitude: 37.7577, // Vị trí mặc định Hà Nội
    longitude: -122.4376,
    zoom: 8,
  });

  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      // Khởi tạo Mapbox Geocoder
      const geocoder = new MapboxGeocoder({
        accessToken: "pk.eyJ1Ijoia2hpZW1waGFtIiwiYSI6ImNsam01eHhnaTAyNmczZmxzcnQ1MTVqN3gifQ.WVqIQlSk52FSN8W7G5gsnw",
        mapboxgl: require('mapbox-gl')
      });
      
      map?.addControl(geocoder);
      // Xử lý sự kiện khi tìm kiếm
      geocoder.on('result', (e: any) => {
        const { coordinates } = e.result.geometry;
        setViewport({
          ...viewport,
          latitude: coordinates[1],
          longitude: coordinates[0],
          zoom: 12
        });
      });
    }
  
  }, []);

  const [marker, setMarker] = useState<MarkerPosition | null>(null);

  const handleMapClick = (event: MapMouseEvent) => {
    const { lngLat } = event;

    // Lưu trữ tọa độ vào state marker
    setMarker({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    });
  };

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const onFinish = () => {};

  const onFinishFailed = () => {};

  const handleChange = (d: any) => {
    setValue(d);
  };
  return (
    <div className="container mx-auto px-4">
      <Breadcrumb
        items={[
          {
            title: 'Quản lý sự kiện',
          },
          {
            title: 'Tạo sự kiện mới',
          },
        ]}
      />

      <div>
        <Map
          mapboxAccessToken="pk.eyJ1Ijoia2hpZW1waGFtIiwiYSI6ImNsam01eHhnaTAyNmczZmxzcnQ1MTVqN3gifQ.WVqIQlSk52FSN8W7G5gsnw"
          initialViewState={{
            longitude: 105.804817,
            latitude: 21.028511,
            zoom: 14,
          }}
          onLoad={onMapLoad}
          ref={mapRef}
          dragRotate={false}
          onMove={(evt) => setViewport(evt.viewState)}
          onClick={handleMapClick}
          style={{ width: 700, height: 400 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <div className="searchbar">
            <div id="geocoder" />
          </div>
          {marker && (
            <Marker
              longitude={marker.longitude}
              latitude={marker.latitude}
              color="red"
            />
          )}
        </Map>
      </div>

      <div className="mt-10 inline-block">
        <h3 className="font-medium text-[24px] text-[#3BA769]">
          Tạo sự kiện mới
        </h3>
        <div className="bg-[#3BA769] w-1/2 h-[1px]"></div>
      </div>

      <Form
        name="EventForm"
        className="w-full"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Tên sự kiện
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item name="nameEvent" className="mb-4 mt-3" rules={nameRules}>
            <Input />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Địa Điểm
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <div className="px-3 cursor-pointer hover:opacity-80 py-2 mt-3 rounded-lg border inline-block border-[#515151]">
            <Form.Item
              name="location"
              hidden
              className="mb-4 mt-3"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
            >
              <Input type="hidden" />
            </Form.Item>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
            >
              <path
                d="M1 7.92285C1 12.7747 5.24448 16.7869 7.12319 18.3252C7.39206 18.5454 7.52811 18.6568 7.72871 18.7132C7.88491 18.7572 8.1148 18.7572 8.271 18.7132C8.47197 18.6567 8.60707 18.5463 8.87695 18.3254C10.7557 16.7871 14.9999 12.7751 14.9999 7.9233C14.9999 6.08718 14.2625 4.32605 12.9497 3.02772C11.637 1.72939 9.8566 1 8.00008 1C6.14357 1 4.36301 1.7295 3.05025 3.02783C1.7375 4.32616 1 6.08674 1 7.92285Z"
                stroke="#3BA769"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 7C6 8.10457 6.89543 9 8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7Z"
                stroke="#3BA769"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Ngày diễn ra
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item name="date" className="mb-4 mt-3 " rules={dateRulesEvent}>
            <DatePicker placeholder="" style={{ width: '30%' }} />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Mô tả sự kiện
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <Form.Item
            name="date"
            className="mb-4 mt-3 "
            rules={[{ required: true, message: 'Vui lòng nhập mo ta' }]}
          >
            <TextArea className="mt-3 w-full" rows={5} />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Hình thu nhỏ
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            className="mb-4 mt-3"
            name="imageThumbnail"
            rules={[
              {
                validator(_: any, value: string) {
                  if (!fileList.length) {
                    return Promise.reject('Bạn cần upload ảnh');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <PreviewImageUpload />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Hình anh noi dung
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            className="mb-4 mt-3"
            name="imageThumbnail"
            rules={[
              {
                validator(_: any, value: string) {
                  if (!fileList.length) {
                    return Promise.reject('Bạn cần upload ảnh');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <PreviewImageUpload />
          </Form.Item>
        </div>

        <div className="mt-6">
          <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
              { value: 1, label: 'Xuất bản sự kiện ngay lập tức' },
              { value: 2, label: 'Xuất bản sự kiện theo lịch' },
            ]}
          />

          {value === 2 && (
            <Form.Item
              name="datePublish"
              className="mb-4 mt-3 "
              rules={dateRulesEvent}
            >
              <DatePicker placeholder="" style={{ width: '30%' }} />
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  );
};

export default CreateEvent;
