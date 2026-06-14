"use client";

import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface ShipmentModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function ShipmentModal({ open, onClose }: ShipmentModalProps) {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: any) => {
    console.log(values);

    message.success("Request submitted successfully!");
    setSubmitted(true);

    form.resetFields();

    setTimeout(() => {
      setSubmitted(false);
      onClose?.();
    }, 1500);
  };

  const inputStyle = {
    background: "#f2f2f2",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#1c1e29",
    outline: "none",
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      destroyOnHidden
      style={{ top: 0 }}
      styles={{
        mask: {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        // content: {
        //   height: "100vh",
        //   padding: 0,
        //   borderRadius: 0,
        //   background: "#ffffff",
        //   overflow: "hidden",
        // },
      }}
    >
      <div className="mb-5">
        <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#1c1e29]">
          Book Shipment
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Fill in the form and we will contact you shortly.
        </p>
      </div>

      <div className="h-px w-full bg-gray-200 mb-5" />

      {/* FORM */}
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* ROW 1 */}
        <div className="grid gap-3 lg:gap-6 sm:grid-cols-2">
          <Form.Item
            name="service"
            rules={[{ required: true }]}
            className="!mb-0"
          >
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Service Type
              </label>
              <Input
                placeholder="Air / Sea / Land"
                variant="outlined"
                style={inputStyle}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="pickupFrom"
            rules={[{ required: true }]}
            className="!mb-0"
          >
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Pickup From
              </label>
              <Input
                placeholder="Origin location"
                variant="outlined"
                style={inputStyle}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="deliveryTo"
            rules={[{ required: true }]}
            className="!mb-0"
          >
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Delivery To
              </label>
              <Input
                placeholder="Destination"
                variant="outlined"
                style={inputStyle}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true }, { type: "email" }]}
            className="!mb-0"
          >
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Email
              </label>
              <Input
                placeholder="example@mail.com"
                variant="outlined"
                style={inputStyle}
              />
            </div>
          </Form.Item>

          {/* PHONE */}
          <Form.Item
            name="telephone"
            rules={[{ required: true }]}
            className="!mb-0 lg:col-span-2"
          >
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Phone Number
              </label>
              <Input
                placeholder="+994 XX XXX XX XX"
                variant="outlined"
                style={inputStyle}
              />
            </div>
          </Form.Item>

          {/* MESSAGE */}
          <Form.Item name="message" className="!mb-0 md:col-span-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Message
              </label>
              <Input.TextArea
                rows={2}
                placeholder="Additional details..."
                variant="outlined"
                style={{
                  ...inputStyle,
                  resize: "none",
                }}
              />
            </div>
          </Form.Item>
          {/* SUBMIT */}
          <Button
            htmlType="submit"
            block
            size="large"
            className={`!h-12  lg:col-span-2 !rounded-xl !font-bold !uppercase tracking-wider transition-all duration-300 ${
              submitted
                ? "!bg-green-500 !text-white"
                : "!bg-[#b11226] hover:!bg-[#8f0e1f] !text-white"
            }`}
          >
            {submitted ? (
              "Submitted ✓"
            ) : (
              <>
                <SendOutlined className="mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
