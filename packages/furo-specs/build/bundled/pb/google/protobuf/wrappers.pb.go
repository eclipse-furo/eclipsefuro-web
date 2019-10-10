// Code generated by protoc-gen-go. DO NOT EDIT.
// source: google/protobuf/wrappers.proto

package google_protobuf

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

// Wrapper message for `string`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type StringValue struct {
	// The JSON representation for `StringValue` is JSON string
	Value                string   `protobuf:"bytes,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *StringValue) Reset()         { *m = StringValue{} }
func (m *StringValue) String() string { return proto.CompactTextString(m) }
func (*StringValue) ProtoMessage()    {}
func (*StringValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{0}
}

func (*StringValue) XXX_WellKnownType() string { return "StringValue" }

func (m *StringValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_StringValue.Unmarshal(m, b)
}
func (m *StringValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_StringValue.Marshal(b, m, deterministic)
}
func (m *StringValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_StringValue.Merge(m, src)
}
func (m *StringValue) XXX_Size() int {
	return xxx_messageInfo_StringValue.Size(m)
}
func (m *StringValue) XXX_DiscardUnknown() {
	xxx_messageInfo_StringValue.DiscardUnknown(m)
}

var xxx_messageInfo_StringValue proto.InternalMessageInfo

func (m *StringValue) GetValue() string {
	if m != nil {
		return m.Value
	}
	return ""
}

// Wrapper message for `int64`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type Int64Value struct {
	// The JSON representation for `Int64Value` is JSON string
	Value                int64    `protobuf:"varint,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Int64Value) Reset()         { *m = Int64Value{} }
func (m *Int64Value) String() string { return proto.CompactTextString(m) }
func (*Int64Value) ProtoMessage()    {}
func (*Int64Value) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{1}
}

func (*Int64Value) XXX_WellKnownType() string { return "Int64Value" }

func (m *Int64Value) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Int64Value.Unmarshal(m, b)
}
func (m *Int64Value) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Int64Value.Marshal(b, m, deterministic)
}
func (m *Int64Value) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Int64Value.Merge(m, src)
}
func (m *Int64Value) XXX_Size() int {
	return xxx_messageInfo_Int64Value.Size(m)
}
func (m *Int64Value) XXX_DiscardUnknown() {
	xxx_messageInfo_Int64Value.DiscardUnknown(m)
}

var xxx_messageInfo_Int64Value proto.InternalMessageInfo

func (m *Int64Value) GetValue() int64 {
	if m != nil {
		return m.Value
	}
	return 0
}

// Wrapper message for `int32`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type Int32Value struct {
	// The JSON representation for `Int32Value` is JSON number
	Value                int32    `protobuf:"varint,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Int32Value) Reset()         { *m = Int32Value{} }
func (m *Int32Value) String() string { return proto.CompactTextString(m) }
func (*Int32Value) ProtoMessage()    {}
func (*Int32Value) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{2}
}

func (*Int32Value) XXX_WellKnownType() string { return "Int32Value" }

func (m *Int32Value) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Int32Value.Unmarshal(m, b)
}
func (m *Int32Value) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Int32Value.Marshal(b, m, deterministic)
}
func (m *Int32Value) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Int32Value.Merge(m, src)
}
func (m *Int32Value) XXX_Size() int {
	return xxx_messageInfo_Int32Value.Size(m)
}
func (m *Int32Value) XXX_DiscardUnknown() {
	xxx_messageInfo_Int32Value.DiscardUnknown(m)
}

var xxx_messageInfo_Int32Value proto.InternalMessageInfo

func (m *Int32Value) GetValue() int32 {
	if m != nil {
		return m.Value
	}
	return 0
}

// Wrapper message for `bool`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type BoolValue struct {
	// The JSON representation for `BoolValue` is JSON `true` and `false`
	Value                bool     `protobuf:"varint,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *BoolValue) Reset()         { *m = BoolValue{} }
func (m *BoolValue) String() string { return proto.CompactTextString(m) }
func (*BoolValue) ProtoMessage()    {}
func (*BoolValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{3}
}

func (*BoolValue) XXX_WellKnownType() string { return "BoolValue" }

func (m *BoolValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_BoolValue.Unmarshal(m, b)
}
func (m *BoolValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_BoolValue.Marshal(b, m, deterministic)
}
func (m *BoolValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BoolValue.Merge(m, src)
}
func (m *BoolValue) XXX_Size() int {
	return xxx_messageInfo_BoolValue.Size(m)
}
func (m *BoolValue) XXX_DiscardUnknown() {
	xxx_messageInfo_BoolValue.DiscardUnknown(m)
}

var xxx_messageInfo_BoolValue proto.InternalMessageInfo

func (m *BoolValue) GetValue() bool {
	if m != nil {
		return m.Value
	}
	return false
}

// Wrapper message for `float`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type FloatValue struct {
	// The JSON representation for `FloatValue` is JSON number
	Value                float32  `protobuf:"fixed32,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FloatValue) Reset()         { *m = FloatValue{} }
func (m *FloatValue) String() string { return proto.CompactTextString(m) }
func (*FloatValue) ProtoMessage()    {}
func (*FloatValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{4}
}

func (*FloatValue) XXX_WellKnownType() string { return "FloatValue" }

func (m *FloatValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FloatValue.Unmarshal(m, b)
}
func (m *FloatValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FloatValue.Marshal(b, m, deterministic)
}
func (m *FloatValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FloatValue.Merge(m, src)
}
func (m *FloatValue) XXX_Size() int {
	return xxx_messageInfo_FloatValue.Size(m)
}
func (m *FloatValue) XXX_DiscardUnknown() {
	xxx_messageInfo_FloatValue.DiscardUnknown(m)
}

var xxx_messageInfo_FloatValue proto.InternalMessageInfo

func (m *FloatValue) GetValue() float32 {
	if m != nil {
		return m.Value
	}
	return 0
}

// Wrapper message for `bytes`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type BytesValue struct {
	// The JSON representation for `BytesValue` is JSON string
	Value                []byte   `protobuf:"bytes,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *BytesValue) Reset()         { *m = BytesValue{} }
func (m *BytesValue) String() string { return proto.CompactTextString(m) }
func (*BytesValue) ProtoMessage()    {}
func (*BytesValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{5}
}

func (*BytesValue) XXX_WellKnownType() string { return "BytesValue" }

func (m *BytesValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_BytesValue.Unmarshal(m, b)
}
func (m *BytesValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_BytesValue.Marshal(b, m, deterministic)
}
func (m *BytesValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BytesValue.Merge(m, src)
}
func (m *BytesValue) XXX_Size() int {
	return xxx_messageInfo_BytesValue.Size(m)
}
func (m *BytesValue) XXX_DiscardUnknown() {
	xxx_messageInfo_BytesValue.DiscardUnknown(m)
}

var xxx_messageInfo_BytesValue proto.InternalMessageInfo

func (m *BytesValue) GetValue() []byte {
	if m != nil {
		return m.Value
	}
	return nil
}

// Wrapper message for `uint32`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type UInt32Value struct {
	// The JSON representation for `UInt32Value` is JSON number
	Value                uint32   `protobuf:"varint,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *UInt32Value) Reset()         { *m = UInt32Value{} }
func (m *UInt32Value) String() string { return proto.CompactTextString(m) }
func (*UInt32Value) ProtoMessage()    {}
func (*UInt32Value) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{6}
}

func (*UInt32Value) XXX_WellKnownType() string { return "UInt32Value" }

func (m *UInt32Value) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_UInt32Value.Unmarshal(m, b)
}
func (m *UInt32Value) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_UInt32Value.Marshal(b, m, deterministic)
}
func (m *UInt32Value) XXX_Merge(src proto.Message) {
	xxx_messageInfo_UInt32Value.Merge(m, src)
}
func (m *UInt32Value) XXX_Size() int {
	return xxx_messageInfo_UInt32Value.Size(m)
}
func (m *UInt32Value) XXX_DiscardUnknown() {
	xxx_messageInfo_UInt32Value.DiscardUnknown(m)
}

var xxx_messageInfo_UInt32Value proto.InternalMessageInfo

func (m *UInt32Value) GetValue() uint32 {
	if m != nil {
		return m.Value
	}
	return 0
}

// Wrapper message for `uint64`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type UInt64Value struct {
	// The JSON representation for `UInt64Value` is JSON string
	Value                uint64   `protobuf:"varint,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *UInt64Value) Reset()         { *m = UInt64Value{} }
func (m *UInt64Value) String() string { return proto.CompactTextString(m) }
func (*UInt64Value) ProtoMessage()    {}
func (*UInt64Value) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{7}
}

func (*UInt64Value) XXX_WellKnownType() string { return "UInt64Value" }

func (m *UInt64Value) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_UInt64Value.Unmarshal(m, b)
}
func (m *UInt64Value) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_UInt64Value.Marshal(b, m, deterministic)
}
func (m *UInt64Value) XXX_Merge(src proto.Message) {
	xxx_messageInfo_UInt64Value.Merge(m, src)
}
func (m *UInt64Value) XXX_Size() int {
	return xxx_messageInfo_UInt64Value.Size(m)
}
func (m *UInt64Value) XXX_DiscardUnknown() {
	xxx_messageInfo_UInt64Value.DiscardUnknown(m)
}

var xxx_messageInfo_UInt64Value proto.InternalMessageInfo

func (m *UInt64Value) GetValue() uint64 {
	if m != nil {
		return m.Value
	}
	return 0
}

// Wrapper message for `double`.  https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto
type DoubleValue struct {
	// The JSON representation for `DoubleValue` is JSON number
	Value                float64  `protobuf:"fixed64,1,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *DoubleValue) Reset()         { *m = DoubleValue{} }
func (m *DoubleValue) String() string { return proto.CompactTextString(m) }
func (*DoubleValue) ProtoMessage()    {}
func (*DoubleValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_5377b62bda767935, []int{8}
}

func (*DoubleValue) XXX_WellKnownType() string { return "DoubleValue" }

func (m *DoubleValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_DoubleValue.Unmarshal(m, b)
}
func (m *DoubleValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_DoubleValue.Marshal(b, m, deterministic)
}
func (m *DoubleValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_DoubleValue.Merge(m, src)
}
func (m *DoubleValue) XXX_Size() int {
	return xxx_messageInfo_DoubleValue.Size(m)
}
func (m *DoubleValue) XXX_DiscardUnknown() {
	xxx_messageInfo_DoubleValue.DiscardUnknown(m)
}

var xxx_messageInfo_DoubleValue proto.InternalMessageInfo

func (m *DoubleValue) GetValue() float64 {
	if m != nil {
		return m.Value
	}
	return 0
}

func init() {
	proto.RegisterType((*StringValue)(nil), "google.protobuf.StringValue")
	proto.RegisterType((*Int64Value)(nil), "google.protobuf.Int64Value")
	proto.RegisterType((*Int32Value)(nil), "google.protobuf.Int32Value")
	proto.RegisterType((*BoolValue)(nil), "google.protobuf.BoolValue")
	proto.RegisterType((*FloatValue)(nil), "google.protobuf.FloatValue")
	proto.RegisterType((*BytesValue)(nil), "google.protobuf.BytesValue")
	proto.RegisterType((*UInt32Value)(nil), "google.protobuf.UInt32Value")
	proto.RegisterType((*UInt64Value)(nil), "google.protobuf.UInt64Value")
	proto.RegisterType((*DoubleValue)(nil), "google.protobuf.DoubleValue")
}

func init() { proto.RegisterFile("google/protobuf/wrappers.proto", fileDescriptor_5377b62bda767935) }

var fileDescriptor_5377b62bda767935 = []byte{
	// 177 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x92, 0x4b, 0xcf, 0xcf, 0x4f,
	0xcf, 0x49, 0xd5, 0x2f, 0x28, 0xca, 0x2f, 0xc9, 0x4f, 0x2a, 0x4d, 0xd3, 0x2f, 0x2f, 0x4a, 0x2c,
	0x28, 0x48, 0x2d, 0x2a, 0xd6, 0x03, 0x8b, 0x08, 0xf1, 0x43, 0xe4, 0xf5, 0x60, 0xf2, 0x4a, 0xca,
	0x5c, 0xdc, 0xc1, 0x25, 0x45, 0x99, 0x79, 0xe9, 0x61, 0x89, 0x39, 0xa5, 0xa9, 0x42, 0x22, 0x5c,
	0xac, 0x65, 0x20, 0x86, 0x04, 0xa3, 0x02, 0xa3, 0x06, 0x67, 0x10, 0x84, 0xa3, 0xa4, 0xc4, 0xc5,
	0xe5, 0x99, 0x57, 0x62, 0x66, 0x82, 0x45, 0x0d, 0x33, 0xaa, 0x1a, 0x63, 0x23, 0x2c, 0x6a, 0x58,
	0x61, 0x6a, 0x14, 0xb9, 0x38, 0x9d, 0xf2, 0xf3, 0x73, 0xb0, 0x28, 0xe1, 0x40, 0x32, 0xc6, 0x2d,
	0x27, 0x3f, 0xb1, 0x04, 0x8b, 0x1a, 0x26, 0x24, 0x35, 0x4e, 0x95, 0x25, 0xa9, 0xc5, 0x58, 0xd4,
	0xf0, 0xc0, 0xd4, 0x28, 0x73, 0x71, 0x87, 0xe2, 0x72, 0x0f, 0x2f, 0x9a, 0x22, 0xac, 0x1e, 0x63,
	0x41, 0x52, 0xe4, 0x92, 0x5f, 0x9a, 0x94, 0x93, 0x8a, 0x45, 0x11, 0x23, 0x54, 0x51, 0x12, 0x1b,
	0x38, 0x40, 0x8d, 0x01, 0x01, 0x00, 0x00, 0xff, 0xff, 0x3a, 0xdd, 0xaa, 0x92, 0x80, 0x01, 0x00,
	0x00,
}