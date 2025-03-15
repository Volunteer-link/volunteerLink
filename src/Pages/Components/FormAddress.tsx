import { Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FormInstance } from 'antd';
const FormAddress = ({ form }: { form: FormInstance }) => {
  const [listProvinces, setListProvinces] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [listDistrict, setListDistrict] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [listWard, setListWard] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [checkLoadDistrict, setCheckLoadDistrict] = useState<boolean>(false);
  const handleSelectProvinces = (value: string, option: any) => {
    fetchDistrict(Number(option.id));
  };

  const handleSelectDistricts = (value: string, option: any) => {
    fetchWard(Number(option.id));
  };

  const fetchDistrict = async (idProvince: number) => {
    try {
      const data = await axios.get(
        `https://open.oapi.vn/location/districts/${idProvince}?page=0&size=1000`
      );
      setListDistrict(data.data.data);
      setCheckLoadDistrict(true);
    } catch (e: any) {
    } finally {
    }
  };

  const fetchWard = async (idProvince: number) => {
    try {
      const data = await axios.get(
        `https://open.oapi.vn/location/wards/${idProvince}?page=0&size=1000`
      );
      setListWard(data.data.data);
    } catch (e: any) {
    } finally {
    }
  };

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const data = await axios.get(
          'https://open.oapi.vn/location/provinces?page=0&size=1000'
        );
        setListProvinces(data.data.data);
      } catch (e: any) {
      } finally {
      }
    };
    fetchProvince();
  }, []);

  return (
    <div>
      <div className="text-base font-medium text-primary-color my-4">
        Tỉnh/Thành phố
      </div>

      <Form.Item
        name="province"
        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
      >
        <Select
          style={{ width: 300 }}
          onChange={(value, option) => handleSelectProvinces(value, option)}
          options={[
            ...listProvinces.map((province) => ({
              value: province.name,
              label: province.name,
              id: province.id,
            })),
          ]}
          placeholder="Chọn tỉnh/thành phố"
        />
      </Form.Item>

      <div className="text-base font-medium text-primary-color my-4">
        Quận/Huyện
      </div>

      <Form.Item
        name="district"
        rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
      >
        <Select
          disabled={!checkLoadDistrict}
          style={{ width: 300 }}
          onChange={handleSelectDistricts}
          options={[
            ...listDistrict.map((district) => ({
              value: district.name,
              label: district.name,
              id: district.id,
            })),
          ]}
          placeholder="Chọn quận/huyện"
        />
      </Form.Item>

      <div className="text-base font-medium text-primary-color my-4">
        Phường/Xã
      </div>
      <Form.Item
        name="ward"
        rules={[{ required: true, message: 'Vui lòng chọn phường/xã!' }]}
      >
        <Select
          disabled={!form.getFieldValue('district')}
          style={{ width: 300 }}
          options={[
            ...listWard.map((ward) => ({
              value: ward.name,
              label: ward.name,
              id: ward.id,
            })),
          ]}
          placeholder="Chọn phường/xã"
        />
      </Form.Item>
    </div>
  );
};

export default FormAddress;
