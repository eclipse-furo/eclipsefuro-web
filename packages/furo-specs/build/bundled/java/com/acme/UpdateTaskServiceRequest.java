// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: BundledService.proto

package com.acme;

/**
 * Protobuf type {@code bundled.UpdateTaskServiceRequest}
 */
public  final class UpdateTaskServiceRequest extends
    com.google.protobuf.GeneratedMessageV3 implements
    // @@protoc_insertion_point(message_implements:bundled.UpdateTaskServiceRequest)
    UpdateTaskServiceRequestOrBuilder {
private static final long serialVersionUID = 0L;
  // Use UpdateTaskServiceRequest.newBuilder() to construct.
  private UpdateTaskServiceRequest(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }
  private UpdateTaskServiceRequest() {
    tsk_ = "";
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet
  getUnknownFields() {
    return this.unknownFields;
  }
  private UpdateTaskServiceRequest(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    this();
    if (extensionRegistry == null) {
      throw new java.lang.NullPointerException();
    }
    int mutable_bitField0_ = 0;
    com.google.protobuf.UnknownFieldSet.Builder unknownFields =
        com.google.protobuf.UnknownFieldSet.newBuilder();
    try {
      boolean done = false;
      while (!done) {
        int tag = input.readTag();
        switch (tag) {
          case 0:
            done = true;
            break;
          case 10: {
            java.lang.String s = input.readStringRequireUtf8();

            tsk_ = s;
            break;
          }
          case 18: {
            com.acme.Task.Builder subBuilder = null;
            if (data_ != null) {
              subBuilder = data_.toBuilder();
            }
            data_ = input.readMessage(com.acme.Task.parser(), extensionRegistry);
            if (subBuilder != null) {
              subBuilder.mergeFrom(data_);
              data_ = subBuilder.buildPartial();
            }

            break;
          }
          default: {
            if (!parseUnknownField(
                input, unknownFields, extensionRegistry, tag)) {
              done = true;
            }
            break;
          }
        }
      }
    } catch (com.google.protobuf.InvalidProtocolBufferException e) {
      throw e.setUnfinishedMessage(this);
    } catch (java.io.IOException e) {
      throw new com.google.protobuf.InvalidProtocolBufferException(
          e).setUnfinishedMessage(this);
    } finally {
      this.unknownFields = unknownFields.build();
      makeExtensionsImmutable();
    }
  }
  public static final com.google.protobuf.Descriptors.Descriptor
      getDescriptor() {
    return com.acme.AnyProto.internal_static_bundled_UpdateTaskServiceRequest_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return com.acme.AnyProto.internal_static_bundled_UpdateTaskServiceRequest_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            com.acme.UpdateTaskServiceRequest.class, com.acme.UpdateTaskServiceRequest.Builder.class);
  }

  public static final int TSK_FIELD_NUMBER = 1;
  private volatile java.lang.Object tsk_;
  /**
   * <code>string tsk = 1;</code>
   */
  public java.lang.String getTsk() {
    java.lang.Object ref = tsk_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = 
          (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      tsk_ = s;
      return s;
    }
  }
  /**
   * <code>string tsk = 1;</code>
   */
  public com.google.protobuf.ByteString
      getTskBytes() {
    java.lang.Object ref = tsk_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b = 
          com.google.protobuf.ByteString.copyFromUtf8(
              (java.lang.String) ref);
      tsk_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int DATA_FIELD_NUMBER = 2;
  private com.acme.Task data_;
  /**
   * <code>.bundled.Task data = 2;</code>
   */
  public boolean hasData() {
    return data_ != null;
  }
  /**
   * <code>.bundled.Task data = 2;</code>
   */
  public com.acme.Task getData() {
    return data_ == null ? com.acme.Task.getDefaultInstance() : data_;
  }
  /**
   * <code>.bundled.Task data = 2;</code>
   */
  public com.acme.TaskOrBuilder getDataOrBuilder() {
    return getData();
  }

  private byte memoizedIsInitialized = -1;
  @java.lang.Override
  public final boolean isInitialized() {
    byte isInitialized = memoizedIsInitialized;
    if (isInitialized == 1) return true;
    if (isInitialized == 0) return false;

    memoizedIsInitialized = 1;
    return true;
  }

  @java.lang.Override
  public void writeTo(com.google.protobuf.CodedOutputStream output)
                      throws java.io.IOException {
    if (!getTskBytes().isEmpty()) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 1, tsk_);
    }
    if (data_ != null) {
      output.writeMessage(2, getData());
    }
    unknownFields.writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (!getTskBytes().isEmpty()) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(1, tsk_);
    }
    if (data_ != null) {
      size += com.google.protobuf.CodedOutputStream
        .computeMessageSize(2, getData());
    }
    size += unknownFields.getSerializedSize();
    memoizedSize = size;
    return size;
  }

  @java.lang.Override
  public boolean equals(final java.lang.Object obj) {
    if (obj == this) {
     return true;
    }
    if (!(obj instanceof com.acme.UpdateTaskServiceRequest)) {
      return super.equals(obj);
    }
    com.acme.UpdateTaskServiceRequest other = (com.acme.UpdateTaskServiceRequest) obj;

    if (!getTsk()
        .equals(other.getTsk())) return false;
    if (hasData() != other.hasData()) return false;
    if (hasData()) {
      if (!getData()
          .equals(other.getData())) return false;
    }
    if (!unknownFields.equals(other.unknownFields)) return false;
    return true;
  }

  @java.lang.Override
  public int hashCode() {
    if (memoizedHashCode != 0) {
      return memoizedHashCode;
    }
    int hash = 41;
    hash = (19 * hash) + getDescriptor().hashCode();
    hash = (37 * hash) + TSK_FIELD_NUMBER;
    hash = (53 * hash) + getTsk().hashCode();
    if (hasData()) {
      hash = (37 * hash) + DATA_FIELD_NUMBER;
      hash = (53 * hash) + getData().hashCode();
    }
    hash = (29 * hash) + unknownFields.hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static com.acme.UpdateTaskServiceRequest parseFrom(
      java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(
      java.nio.ByteBuffer data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(
      byte[] data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.UpdateTaskServiceRequest parseDelimitedFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input);
  }
  public static com.acme.UpdateTaskServiceRequest parseDelimitedFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(
      com.google.protobuf.CodedInputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.UpdateTaskServiceRequest parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input, extensionRegistry);
  }

  @java.lang.Override
  public Builder newBuilderForType() { return newBuilder(); }
  public static Builder newBuilder() {
    return DEFAULT_INSTANCE.toBuilder();
  }
  public static Builder newBuilder(com.acme.UpdateTaskServiceRequest prototype) {
    return DEFAULT_INSTANCE.toBuilder().mergeFrom(prototype);
  }
  @java.lang.Override
  public Builder toBuilder() {
    return this == DEFAULT_INSTANCE
        ? new Builder() : new Builder().mergeFrom(this);
  }

  @java.lang.Override
  protected Builder newBuilderForType(
      com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
    Builder builder = new Builder(parent);
    return builder;
  }
  /**
   * Protobuf type {@code bundled.UpdateTaskServiceRequest}
   */
  public static final class Builder extends
      com.google.protobuf.GeneratedMessageV3.Builder<Builder> implements
      // @@protoc_insertion_point(builder_implements:bundled.UpdateTaskServiceRequest)
      com.acme.UpdateTaskServiceRequestOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor
        getDescriptor() {
      return com.acme.AnyProto.internal_static_bundled_UpdateTaskServiceRequest_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return com.acme.AnyProto.internal_static_bundled_UpdateTaskServiceRequest_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              com.acme.UpdateTaskServiceRequest.class, com.acme.UpdateTaskServiceRequest.Builder.class);
    }

    // Construct using com.acme.UpdateTaskServiceRequest.newBuilder()
    private Builder() {
      maybeForceBuilderInitialization();
    }

    private Builder(
        com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
      super(parent);
      maybeForceBuilderInitialization();
    }
    private void maybeForceBuilderInitialization() {
      if (com.google.protobuf.GeneratedMessageV3
              .alwaysUseFieldBuilders) {
      }
    }
    @java.lang.Override
    public Builder clear() {
      super.clear();
      tsk_ = "";

      if (dataBuilder_ == null) {
        data_ = null;
      } else {
        data_ = null;
        dataBuilder_ = null;
      }
      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor
        getDescriptorForType() {
      return com.acme.AnyProto.internal_static_bundled_UpdateTaskServiceRequest_descriptor;
    }

    @java.lang.Override
    public com.acme.UpdateTaskServiceRequest getDefaultInstanceForType() {
      return com.acme.UpdateTaskServiceRequest.getDefaultInstance();
    }

    @java.lang.Override
    public com.acme.UpdateTaskServiceRequest build() {
      com.acme.UpdateTaskServiceRequest result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public com.acme.UpdateTaskServiceRequest buildPartial() {
      com.acme.UpdateTaskServiceRequest result = new com.acme.UpdateTaskServiceRequest(this);
      result.tsk_ = tsk_;
      if (dataBuilder_ == null) {
        result.data_ = data_;
      } else {
        result.data_ = dataBuilder_.build();
      }
      onBuilt();
      return result;
    }

    @java.lang.Override
    public Builder clone() {
      return super.clone();
    }
    @java.lang.Override
    public Builder setField(
        com.google.protobuf.Descriptors.FieldDescriptor field,
        java.lang.Object value) {
      return super.setField(field, value);
    }
    @java.lang.Override
    public Builder clearField(
        com.google.protobuf.Descriptors.FieldDescriptor field) {
      return super.clearField(field);
    }
    @java.lang.Override
    public Builder clearOneof(
        com.google.protobuf.Descriptors.OneofDescriptor oneof) {
      return super.clearOneof(oneof);
    }
    @java.lang.Override
    public Builder setRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field,
        int index, java.lang.Object value) {
      return super.setRepeatedField(field, index, value);
    }
    @java.lang.Override
    public Builder addRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field,
        java.lang.Object value) {
      return super.addRepeatedField(field, value);
    }
    @java.lang.Override
    public Builder mergeFrom(com.google.protobuf.Message other) {
      if (other instanceof com.acme.UpdateTaskServiceRequest) {
        return mergeFrom((com.acme.UpdateTaskServiceRequest)other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(com.acme.UpdateTaskServiceRequest other) {
      if (other == com.acme.UpdateTaskServiceRequest.getDefaultInstance()) return this;
      if (!other.getTsk().isEmpty()) {
        tsk_ = other.tsk_;
        onChanged();
      }
      if (other.hasData()) {
        mergeData(other.getData());
      }
      this.mergeUnknownFields(other.unknownFields);
      onChanged();
      return this;
    }

    @java.lang.Override
    public final boolean isInitialized() {
      return true;
    }

    @java.lang.Override
    public Builder mergeFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws java.io.IOException {
      com.acme.UpdateTaskServiceRequest parsedMessage = null;
      try {
        parsedMessage = PARSER.parsePartialFrom(input, extensionRegistry);
      } catch (com.google.protobuf.InvalidProtocolBufferException e) {
        parsedMessage = (com.acme.UpdateTaskServiceRequest) e.getUnfinishedMessage();
        throw e.unwrapIOException();
      } finally {
        if (parsedMessage != null) {
          mergeFrom(parsedMessage);
        }
      }
      return this;
    }

    private java.lang.Object tsk_ = "";
    /**
     * <code>string tsk = 1;</code>
     */
    public java.lang.String getTsk() {
      java.lang.Object ref = tsk_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs =
            (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        tsk_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <code>string tsk = 1;</code>
     */
    public com.google.protobuf.ByteString
        getTskBytes() {
      java.lang.Object ref = tsk_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b = 
            com.google.protobuf.ByteString.copyFromUtf8(
                (java.lang.String) ref);
        tsk_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <code>string tsk = 1;</code>
     */
    public Builder setTsk(
        java.lang.String value) {
      if (value == null) {
    throw new NullPointerException();
  }
  
      tsk_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>string tsk = 1;</code>
     */
    public Builder clearTsk() {
      
      tsk_ = getDefaultInstance().getTsk();
      onChanged();
      return this;
    }
    /**
     * <code>string tsk = 1;</code>
     */
    public Builder setTskBytes(
        com.google.protobuf.ByteString value) {
      if (value == null) {
    throw new NullPointerException();
  }
  checkByteStringIsUtf8(value);
      
      tsk_ = value;
      onChanged();
      return this;
    }

    private com.acme.Task data_;
    private com.google.protobuf.SingleFieldBuilderV3<
        com.acme.Task, com.acme.Task.Builder, com.acme.TaskOrBuilder> dataBuilder_;
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public boolean hasData() {
      return dataBuilder_ != null || data_ != null;
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public com.acme.Task getData() {
      if (dataBuilder_ == null) {
        return data_ == null ? com.acme.Task.getDefaultInstance() : data_;
      } else {
        return dataBuilder_.getMessage();
      }
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public Builder setData(com.acme.Task value) {
      if (dataBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        data_ = value;
        onChanged();
      } else {
        dataBuilder_.setMessage(value);
      }

      return this;
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public Builder setData(
        com.acme.Task.Builder builderForValue) {
      if (dataBuilder_ == null) {
        data_ = builderForValue.build();
        onChanged();
      } else {
        dataBuilder_.setMessage(builderForValue.build());
      }

      return this;
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public Builder mergeData(com.acme.Task value) {
      if (dataBuilder_ == null) {
        if (data_ != null) {
          data_ =
            com.acme.Task.newBuilder(data_).mergeFrom(value).buildPartial();
        } else {
          data_ = value;
        }
        onChanged();
      } else {
        dataBuilder_.mergeFrom(value);
      }

      return this;
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public Builder clearData() {
      if (dataBuilder_ == null) {
        data_ = null;
        onChanged();
      } else {
        data_ = null;
        dataBuilder_ = null;
      }

      return this;
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public com.acme.Task.Builder getDataBuilder() {
      
      onChanged();
      return getDataFieldBuilder().getBuilder();
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    public com.acme.TaskOrBuilder getDataOrBuilder() {
      if (dataBuilder_ != null) {
        return dataBuilder_.getMessageOrBuilder();
      } else {
        return data_ == null ?
            com.acme.Task.getDefaultInstance() : data_;
      }
    }
    /**
     * <code>.bundled.Task data = 2;</code>
     */
    private com.google.protobuf.SingleFieldBuilderV3<
        com.acme.Task, com.acme.Task.Builder, com.acme.TaskOrBuilder> 
        getDataFieldBuilder() {
      if (dataBuilder_ == null) {
        dataBuilder_ = new com.google.protobuf.SingleFieldBuilderV3<
            com.acme.Task, com.acme.Task.Builder, com.acme.TaskOrBuilder>(
                getData(),
                getParentForChildren(),
                isClean());
        data_ = null;
      }
      return dataBuilder_;
    }
    @java.lang.Override
    public final Builder setUnknownFields(
        final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.setUnknownFields(unknownFields);
    }

    @java.lang.Override
    public final Builder mergeUnknownFields(
        final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.mergeUnknownFields(unknownFields);
    }


    // @@protoc_insertion_point(builder_scope:bundled.UpdateTaskServiceRequest)
  }

  // @@protoc_insertion_point(class_scope:bundled.UpdateTaskServiceRequest)
  private static final com.acme.UpdateTaskServiceRequest DEFAULT_INSTANCE;
  static {
    DEFAULT_INSTANCE = new com.acme.UpdateTaskServiceRequest();
  }

  public static com.acme.UpdateTaskServiceRequest getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<UpdateTaskServiceRequest>
      PARSER = new com.google.protobuf.AbstractParser<UpdateTaskServiceRequest>() {
    @java.lang.Override
    public UpdateTaskServiceRequest parsePartialFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws com.google.protobuf.InvalidProtocolBufferException {
      return new UpdateTaskServiceRequest(input, extensionRegistry);
    }
  };

  public static com.google.protobuf.Parser<UpdateTaskServiceRequest> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<UpdateTaskServiceRequest> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public com.acme.UpdateTaskServiceRequest getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }

}

