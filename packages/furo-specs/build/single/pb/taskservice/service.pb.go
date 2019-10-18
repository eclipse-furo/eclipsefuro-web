// Code generated by protoc-gen-go. DO NOT EDIT.
// source: taskservice/service.proto

package taskservice

import (
	task "../task"
	context "context"
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	empty "github.com/golang/protobuf/ptypes/empty"
	_ "google.golang.org/genproto/googleapis/api/annotations"
	grpc "google.golang.org/grpc"
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

type CreateTaskServiceRequest struct {
	Data                 *task.Task `protobuf:"bytes,1,opt,name=data,proto3" json:"data,omitempty"`
	XXX_NoUnkeyedLiteral struct{}   `json:"-"`
	XXX_unrecognized     []byte     `json:"-"`
	XXX_sizecache        int32      `json:"-"`
}

func (m *CreateTaskServiceRequest) Reset()         { *m = CreateTaskServiceRequest{} }
func (m *CreateTaskServiceRequest) String() string { return proto.CompactTextString(m) }
func (*CreateTaskServiceRequest) ProtoMessage()    {}
func (*CreateTaskServiceRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_6981bd005514d040, []int{0}
}

func (m *CreateTaskServiceRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_CreateTaskServiceRequest.Unmarshal(m, b)
}
func (m *CreateTaskServiceRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_CreateTaskServiceRequest.Marshal(b, m, deterministic)
}
func (m *CreateTaskServiceRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CreateTaskServiceRequest.Merge(m, src)
}
func (m *CreateTaskServiceRequest) XXX_Size() int {
	return xxx_messageInfo_CreateTaskServiceRequest.Size(m)
}
func (m *CreateTaskServiceRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_CreateTaskServiceRequest.DiscardUnknown(m)
}

var xxx_messageInfo_CreateTaskServiceRequest proto.InternalMessageInfo

func (m *CreateTaskServiceRequest) GetData() *task.Task {
	if m != nil {
		return m.Data
	}
	return nil
}

type DeleteTaskServiceRequest struct {
	Tsk                  string       `protobuf:"bytes,1,opt,name=tsk,proto3" json:"tsk,omitempty"`
	Data                 *empty.Empty `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
	XXX_NoUnkeyedLiteral struct{}     `json:"-"`
	XXX_unrecognized     []byte       `json:"-"`
	XXX_sizecache        int32        `json:"-"`
}

func (m *DeleteTaskServiceRequest) Reset()         { *m = DeleteTaskServiceRequest{} }
func (m *DeleteTaskServiceRequest) String() string { return proto.CompactTextString(m) }
func (*DeleteTaskServiceRequest) ProtoMessage()    {}
func (*DeleteTaskServiceRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_6981bd005514d040, []int{1}
}

func (m *DeleteTaskServiceRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_DeleteTaskServiceRequest.Unmarshal(m, b)
}
func (m *DeleteTaskServiceRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_DeleteTaskServiceRequest.Marshal(b, m, deterministic)
}
func (m *DeleteTaskServiceRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_DeleteTaskServiceRequest.Merge(m, src)
}
func (m *DeleteTaskServiceRequest) XXX_Size() int {
	return xxx_messageInfo_DeleteTaskServiceRequest.Size(m)
}
func (m *DeleteTaskServiceRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_DeleteTaskServiceRequest.DiscardUnknown(m)
}

var xxx_messageInfo_DeleteTaskServiceRequest proto.InternalMessageInfo

func (m *DeleteTaskServiceRequest) GetTsk() string {
	if m != nil {
		return m.Tsk
	}
	return ""
}

func (m *DeleteTaskServiceRequest) GetData() *empty.Empty {
	if m != nil {
		return m.Data
	}
	return nil
}

type GetTaskServiceRequest struct {
	Tsk                  string   `protobuf:"bytes,1,opt,name=tsk,proto3" json:"tsk,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetTaskServiceRequest) Reset()         { *m = GetTaskServiceRequest{} }
func (m *GetTaskServiceRequest) String() string { return proto.CompactTextString(m) }
func (*GetTaskServiceRequest) ProtoMessage()    {}
func (*GetTaskServiceRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_6981bd005514d040, []int{2}
}

func (m *GetTaskServiceRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetTaskServiceRequest.Unmarshal(m, b)
}
func (m *GetTaskServiceRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetTaskServiceRequest.Marshal(b, m, deterministic)
}
func (m *GetTaskServiceRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetTaskServiceRequest.Merge(m, src)
}
func (m *GetTaskServiceRequest) XXX_Size() int {
	return xxx_messageInfo_GetTaskServiceRequest.Size(m)
}
func (m *GetTaskServiceRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_GetTaskServiceRequest.DiscardUnknown(m)
}

var xxx_messageInfo_GetTaskServiceRequest proto.InternalMessageInfo

func (m *GetTaskServiceRequest) GetTsk() string {
	if m != nil {
		return m.Tsk
	}
	return ""
}

type ListTaskServiceRequest struct {
	//Partial representation, fields=id,name
	Fields string `protobuf:"bytes,1,opt,name=fields,proto3" json:"fields,omitempty"`
	//*
	// Sort fields, comma separated list for the ordering
	// use **?filter=-display_name** with a dash to sort descending
	// use **?filter=display_name** to sort ascending
	OrderBy string `protobuf:"bytes,2,opt,name=order_by,json=orderBy,proto3" json:"order_by,omitempty"`
	//Filter
	Filter string `protobuf:"bytes,3,opt,name=filter,proto3" json:"filter,omitempty"`
	//Page number for paginated content. Tipp: follow the HATEOAS next, prev,...
	Page int32 `protobuf:"varint,4,opt,name=page,proto3" json:"page,omitempty"`
	//Number of elements to return per page
	Limit int32 `protobuf:"varint,5,opt,name=limit,proto3" json:"limit,omitempty"`
	//https://cloud.google.com/apis/design/design_patterns#resource_view
	View string `protobuf:"bytes,8,opt,name=view,proto3" json:"view,omitempty"`
	//Query term to search a task
	Q                    string   `protobuf:"bytes,11,opt,name=q,proto3" json:"q,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *ListTaskServiceRequest) Reset()         { *m = ListTaskServiceRequest{} }
func (m *ListTaskServiceRequest) String() string { return proto.CompactTextString(m) }
func (*ListTaskServiceRequest) ProtoMessage()    {}
func (*ListTaskServiceRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_6981bd005514d040, []int{3}
}

func (m *ListTaskServiceRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ListTaskServiceRequest.Unmarshal(m, b)
}
func (m *ListTaskServiceRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ListTaskServiceRequest.Marshal(b, m, deterministic)
}
func (m *ListTaskServiceRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ListTaskServiceRequest.Merge(m, src)
}
func (m *ListTaskServiceRequest) XXX_Size() int {
	return xxx_messageInfo_ListTaskServiceRequest.Size(m)
}
func (m *ListTaskServiceRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_ListTaskServiceRequest.DiscardUnknown(m)
}

var xxx_messageInfo_ListTaskServiceRequest proto.InternalMessageInfo

func (m *ListTaskServiceRequest) GetFields() string {
	if m != nil {
		return m.Fields
	}
	return ""
}

func (m *ListTaskServiceRequest) GetOrderBy() string {
	if m != nil {
		return m.OrderBy
	}
	return ""
}

func (m *ListTaskServiceRequest) GetFilter() string {
	if m != nil {
		return m.Filter
	}
	return ""
}

func (m *ListTaskServiceRequest) GetPage() int32 {
	if m != nil {
		return m.Page
	}
	return 0
}

func (m *ListTaskServiceRequest) GetLimit() int32 {
	if m != nil {
		return m.Limit
	}
	return 0
}

func (m *ListTaskServiceRequest) GetView() string {
	if m != nil {
		return m.View
	}
	return ""
}

func (m *ListTaskServiceRequest) GetQ() string {
	if m != nil {
		return m.Q
	}
	return ""
}

type UpdateTaskServiceRequest struct {
	Tsk                  string     `protobuf:"bytes,1,opt,name=tsk,proto3" json:"tsk,omitempty"`
	Data                 *task.Task `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
	XXX_NoUnkeyedLiteral struct{}   `json:"-"`
	XXX_unrecognized     []byte     `json:"-"`
	XXX_sizecache        int32      `json:"-"`
}

func (m *UpdateTaskServiceRequest) Reset()         { *m = UpdateTaskServiceRequest{} }
func (m *UpdateTaskServiceRequest) String() string { return proto.CompactTextString(m) }
func (*UpdateTaskServiceRequest) ProtoMessage()    {}
func (*UpdateTaskServiceRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_6981bd005514d040, []int{4}
}

func (m *UpdateTaskServiceRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_UpdateTaskServiceRequest.Unmarshal(m, b)
}
func (m *UpdateTaskServiceRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_UpdateTaskServiceRequest.Marshal(b, m, deterministic)
}
func (m *UpdateTaskServiceRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_UpdateTaskServiceRequest.Merge(m, src)
}
func (m *UpdateTaskServiceRequest) XXX_Size() int {
	return xxx_messageInfo_UpdateTaskServiceRequest.Size(m)
}
func (m *UpdateTaskServiceRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_UpdateTaskServiceRequest.DiscardUnknown(m)
}

var xxx_messageInfo_UpdateTaskServiceRequest proto.InternalMessageInfo

func (m *UpdateTaskServiceRequest) GetTsk() string {
	if m != nil {
		return m.Tsk
	}
	return ""
}

func (m *UpdateTaskServiceRequest) GetData() *task.Task {
	if m != nil {
		return m.Data
	}
	return nil
}

func init() {
	proto.RegisterType((*CreateTaskServiceRequest)(nil), "taskservice.CreateTaskServiceRequest")
	proto.RegisterType((*DeleteTaskServiceRequest)(nil), "taskservice.DeleteTaskServiceRequest")
	proto.RegisterType((*GetTaskServiceRequest)(nil), "taskservice.GetTaskServiceRequest")
	proto.RegisterType((*ListTaskServiceRequest)(nil), "taskservice.ListTaskServiceRequest")
	proto.RegisterType((*UpdateTaskServiceRequest)(nil), "taskservice.UpdateTaskServiceRequest")
}

func init() { proto.RegisterFile("taskservice/service.proto", fileDescriptor_6981bd005514d040) }

var fileDescriptor_6981bd005514d040 = []byte{
	// 491 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x8c, 0x93, 0xc1, 0x6e, 0xd3, 0x40,
	0x10, 0x86, 0xe5, 0x36, 0x69, 0x9b, 0x09, 0x12, 0xd5, 0xaa, 0x44, 0x8e, 0x03, 0x51, 0xea, 0x08,
	0xd4, 0x72, 0xb0, 0xa5, 0x72, 0xe3, 0x48, 0xa9, 0xb8, 0xf4, 0x64, 0x40, 0xe2, 0x86, 0x36, 0xf1,
	0xd4, 0xda, 0xda, 0xf1, 0x3a, 0xde, 0x4d, 0x50, 0x84, 0xb8, 0xf0, 0x0a, 0x3c, 0x08, 0x47, 0x1e,
	0x84, 0x57, 0xe0, 0x41, 0xd0, 0x8e, 0x37, 0x72, 0x12, 0x1c, 0xd1, 0x4b, 0xb2, 0xb3, 0x9e, 0xf9,
	0xbf, 0xf1, 0xcc, 0x6f, 0xe8, 0x6b, 0xae, 0x52, 0x85, 0xe5, 0x52, 0x4c, 0x31, 0xb4, 0xff, 0x41,
	0x51, 0x4a, 0x2d, 0x59, 0x77, 0xe3, 0x91, 0xf7, 0x34, 0x91, 0x32, 0xc9, 0x30, 0xe4, 0x85, 0x08,
	0x79, 0x9e, 0x4b, 0xcd, 0xb5, 0x90, 0xb9, 0xaa, 0x52, 0xbd, 0xc7, 0x26, 0x35, 0x34, 0x3f, 0xf6,
	0x62, 0x60, 0xd3, 0x29, 0x9a, 0x2c, 0xee, 0x42, 0x9c, 0x15, 0x7a, 0x55, 0x3d, 0xf4, 0x5f, 0x83,
	0x7b, 0x5d, 0x22, 0xd7, 0xf8, 0x81, 0xab, 0xf4, 0x7d, 0x05, 0x88, 0x70, 0xbe, 0x40, 0xa5, 0xd9,
	0x10, 0x5a, 0x31, 0xd7, 0xdc, 0x75, 0x46, 0xce, 0x45, 0xf7, 0x0a, 0x02, 0xd2, 0x34, 0x79, 0x11,
	0xdd, 0xfb, 0x9f, 0xc0, 0x7d, 0x8b, 0x19, 0x36, 0xd6, 0x9e, 0xc2, 0xa1, 0x56, 0x29, 0x95, 0x76,
	0x22, 0x73, 0x64, 0x2f, 0xad, 0xda, 0x01, 0xa9, 0xf5, 0x82, 0xaa, 0xab, 0x60, 0xdd, 0x55, 0x70,
	0x63, 0xba, 0xb2, 0xca, 0x97, 0xf0, 0xe4, 0x1d, 0xea, 0x87, 0xc8, 0xfa, 0x3f, 0x1d, 0xe8, 0xdd,
	0x0a, 0xd5, 0x94, 0xdc, 0x83, 0xa3, 0x3b, 0x81, 0x59, 0xac, 0x6c, 0xbe, 0x8d, 0x58, 0x1f, 0x4e,
	0x64, 0x19, 0x63, 0xf9, 0x79, 0xb2, 0xa2, 0x6e, 0x3a, 0xd1, 0x31, 0xc5, 0x6f, 0x56, 0x55, 0x49,
	0xa6, 0xb1, 0x74, 0x0f, 0xd7, 0x25, 0x26, 0x62, 0x0c, 0x5a, 0x05, 0x4f, 0xd0, 0x6d, 0x8d, 0x9c,
	0x8b, 0x76, 0x44, 0x67, 0x76, 0x06, 0xed, 0x4c, 0xcc, 0x84, 0x76, 0xdb, 0x74, 0x59, 0x05, 0x26,
	0x73, 0x29, 0xf0, 0x8b, 0x7b, 0x42, 0xf5, 0x74, 0x66, 0x8f, 0xc0, 0x99, 0xbb, 0x5d, 0xba, 0x70,
	0xe6, 0xfe, 0x2d, 0xb8, 0x1f, 0x8b, 0x98, 0x3f, 0x70, 0x6c, 0xc3, 0xad, 0xb1, 0xfd, 0xb3, 0x84,
	0xab, 0x5f, 0x2d, 0xe8, 0x6e, 0x08, 0xb1, 0x7b, 0x80, 0x7a, 0xa1, 0xec, 0x79, 0xb0, 0x61, 0x9c,
	0x60, 0xdf, 0xa6, 0xbd, 0xd3, 0x5a, 0xf6, 0x26, 0xd7, 0x42, 0xaf, 0xfc, 0xf1, 0xf7, 0xdf, 0x7f,
	0x7e, 0x1c, 0x3c, 0x63, 0x83, 0x70, 0x26, 0xa7, 0xa9, 0x21, 0x91, 0xa5, 0x54, 0x38, 0x25, 0x8d,
	0xe0, 0x5e, 0xc9, 0x9c, 0x2d, 0x01, 0x6a, 0x03, 0xec, 0xb0, 0xf6, 0x39, 0xc3, 0xdb, 0xb3, 0x79,
	0xff, 0x92, 0x88, 0x63, 0x76, 0xbe, 0x4b, 0xfc, 0xaa, 0x55, 0xfa, 0x2d, 0x8c, 0x49, 0xaf, 0xe2,
	0x26, 0x70, 0x6c, 0xed, 0xc1, 0xfc, 0x2d, 0x68, 0xa3, 0x69, 0x1a, 0xde, 0xee, 0x05, 0xb1, 0x46,
	0x6c, 0xd8, 0xcc, 0x4a, 0x50, 0x57, 0x20, 0x01, 0x9d, 0xb5, 0xb7, 0x14, 0x1b, 0x6f, 0xa1, 0x9a,
	0x3d, 0xe7, 0x9d, 0xd5, 0xac, 0x6b, 0x99, 0x65, 0x38, 0x35, 0x9f, 0xa6, 0x7f, 0x4e, 0xbc, 0x01,
	0xeb, 0xef, 0xf2, 0x32, 0xa1, 0x2c, 0xaa, 0x00, 0xa8, 0x5d, 0xb1, 0x33, 0xcb, 0x7d, 0x76, 0x69,
	0x78, 0xb3, 0xff, 0x4c, 0x71, 0x41, 0x4a, 0x44, 0x9c, 0x1c, 0xd1, 0x02, 0x5e, 0xfd, 0x0d, 0x00,
	0x00, 0xff, 0xff, 0x76, 0xf4, 0x85, 0x8a, 0x77, 0x04, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// TaskServiceClient is the client API for TaskService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type TaskServiceClient interface {
	// Creates a new Task
	CreateTask(ctx context.Context, in *CreateTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskEntity, error)
	// Delete a Task
	DeleteTask(ctx context.Context, in *DeleteTaskServiceRequest, opts ...grpc.CallOption) (*empty.Empty, error)
	// The Get method takes zero or more parameters, and returns a TaskEntity which contains a Task
	GetTask(ctx context.Context, in *GetTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskEntity, error)
	// The List method takes zero or more parameters as input, and returns a TaskCollection of TaskEntity that match the input parameters.
	ListTasks(ctx context.Context, in *ListTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskCollection, error)
	// Updates a Task, partial updates are not supported
	UpdateTask(ctx context.Context, in *UpdateTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskEntity, error)
}

type taskServiceClient struct {
	cc *grpc.ClientConn
}

func NewTaskServiceClient(cc *grpc.ClientConn) TaskServiceClient {
	return &taskServiceClient{cc}
}

func (c *taskServiceClient) CreateTask(ctx context.Context, in *CreateTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskEntity, error) {
	out := new(task.TaskEntity)
	err := c.cc.Invoke(ctx, "/taskservice.TaskService/CreateTask", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *taskServiceClient) DeleteTask(ctx context.Context, in *DeleteTaskServiceRequest, opts ...grpc.CallOption) (*empty.Empty, error) {
	out := new(empty.Empty)
	err := c.cc.Invoke(ctx, "/taskservice.TaskService/DeleteTask", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *taskServiceClient) GetTask(ctx context.Context, in *GetTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskEntity, error) {
	out := new(task.TaskEntity)
	err := c.cc.Invoke(ctx, "/taskservice.TaskService/GetTask", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *taskServiceClient) ListTasks(ctx context.Context, in *ListTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskCollection, error) {
	out := new(task.TaskCollection)
	err := c.cc.Invoke(ctx, "/taskservice.TaskService/ListTasks", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *taskServiceClient) UpdateTask(ctx context.Context, in *UpdateTaskServiceRequest, opts ...grpc.CallOption) (*task.TaskEntity, error) {
	out := new(task.TaskEntity)
	err := c.cc.Invoke(ctx, "/taskservice.TaskService/UpdateTask", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// TaskServiceServer is the server API for TaskService service.
type TaskServiceServer interface {
	// Creates a new Task
	CreateTask(context.Context, *CreateTaskServiceRequest) (*task.TaskEntity, error)
	// Delete a Task
	DeleteTask(context.Context, *DeleteTaskServiceRequest) (*empty.Empty, error)
	// The Get method takes zero or more parameters, and returns a TaskEntity which contains a Task
	GetTask(context.Context, *GetTaskServiceRequest) (*task.TaskEntity, error)
	// The List method takes zero or more parameters as input, and returns a TaskCollection of TaskEntity that match the input parameters.
	ListTasks(context.Context, *ListTaskServiceRequest) (*task.TaskCollection, error)
	// Updates a Task, partial updates are not supported
	UpdateTask(context.Context, *UpdateTaskServiceRequest) (*task.TaskEntity, error)
}

func RegisterTaskServiceServer(s *grpc.Server, srv TaskServiceServer) {
	s.RegisterService(&_TaskService_serviceDesc, srv)
}

func _TaskService_CreateTask_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateTaskServiceRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TaskServiceServer).CreateTask(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/taskservice.TaskService/CreateTask",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TaskServiceServer).CreateTask(ctx, req.(*CreateTaskServiceRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TaskService_DeleteTask_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteTaskServiceRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TaskServiceServer).DeleteTask(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/taskservice.TaskService/DeleteTask",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TaskServiceServer).DeleteTask(ctx, req.(*DeleteTaskServiceRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TaskService_GetTask_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetTaskServiceRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TaskServiceServer).GetTask(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/taskservice.TaskService/GetTask",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TaskServiceServer).GetTask(ctx, req.(*GetTaskServiceRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TaskService_ListTasks_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListTaskServiceRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TaskServiceServer).ListTasks(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/taskservice.TaskService/ListTasks",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TaskServiceServer).ListTasks(ctx, req.(*ListTaskServiceRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TaskService_UpdateTask_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateTaskServiceRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TaskServiceServer).UpdateTask(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/taskservice.TaskService/UpdateTask",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TaskServiceServer).UpdateTask(ctx, req.(*UpdateTaskServiceRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _TaskService_serviceDesc = grpc.ServiceDesc{
	ServiceName: "taskservice.TaskService",
	HandlerType: (*TaskServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateTask",
			Handler:    _TaskService_CreateTask_Handler,
		},
		{
			MethodName: "DeleteTask",
			Handler:    _TaskService_DeleteTask_Handler,
		},
		{
			MethodName: "GetTask",
			Handler:    _TaskService_GetTask_Handler,
		},
		{
			MethodName: "ListTasks",
			Handler:    _TaskService_ListTasks_Handler,
		},
		{
			MethodName: "UpdateTask",
			Handler:    _TaskService_UpdateTask_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "taskservice/service.proto",
}
