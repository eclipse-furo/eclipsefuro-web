// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: BundledService.proto

package com.acme;

/**
 * Protobuf type {@code bundled.UpdateExperimentServiceRequest}
 */
public  final class UpdateExperimentServiceRequest extends
    com.google.protobuf.GeneratedMessageV3 implements
    // @@protoc_insertion_point(message_implements:bundled.UpdateExperimentServiceRequest)
    UpdateExperimentServiceRequestOrBuilder {
private static final long serialVersionUID = 0L;
  // Use UpdateExperimentServiceRequest.newBuilder() to construct.
  private UpdateExperimentServiceRequest(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }
  private UpdateExperimentServiceRequest() {
    exp_ = "";
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet
  getUnknownFields() {
    return this.unknownFields;
  }
  private UpdateExperimentServiceRequest(
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

            exp_ = s;
            break;
          }
          case 18: {
            com.acme.Experiment.Builder subBuilder = null;
            if (data_ != null) {
              subBuilder = data_.toBuilder();
            }
            data_ = input.readMessage(com.acme.Experiment.parser(), extensionRegistry);
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
    return com.acme.AnyProto.internal_static_bundled_UpdateExperimentServiceRequest_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return com.acme.AnyProto.internal_static_bundled_UpdateExperimentServiceRequest_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            com.acme.UpdateExperimentServiceRequest.class, com.acme.UpdateExperimentServiceRequest.Builder.class);
  }

  public static final int EXP_FIELD_NUMBER = 1;
  private volatile java.lang.Object exp_;
  /**
   * <code>string exp = 1;</code>
   */
  public java.lang.String getExp() {
    java.lang.Object ref = exp_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = 
          (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      exp_ = s;
      return s;
    }
  }
  /**
   * <code>string exp = 1;</code>
   */
  public com.google.protobuf.ByteString
      getExpBytes() {
    java.lang.Object ref = exp_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b = 
          com.google.protobuf.ByteString.copyFromUtf8(
              (java.lang.String) ref);
      exp_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int DATA_FIELD_NUMBER = 2;
  private com.acme.Experiment data_;
  /**
   * <code>.bundled.Experiment data = 2;</code>
   */
  public boolean hasData() {
    return data_ != null;
  }
  /**
   * <code>.bundled.Experiment data = 2;</code>
   */
  public com.acme.Experiment getData() {
    return data_ == null ? com.acme.Experiment.getDefaultInstance() : data_;
  }
  /**
   * <code>.bundled.Experiment data = 2;</code>
   */
  public com.acme.ExperimentOrBuilder getDataOrBuilder() {
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
    if (!getExpBytes().isEmpty()) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 1, exp_);
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
    if (!getExpBytes().isEmpty()) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(1, exp_);
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
    if (!(obj instanceof com.acme.UpdateExperimentServiceRequest)) {
      return super.equals(obj);
    }
    com.acme.UpdateExperimentServiceRequest other = (com.acme.UpdateExperimentServiceRequest) obj;

    if (!getExp()
        .equals(other.getExp())) return false;
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
    hash = (37 * hash) + EXP_FIELD_NUMBER;
    hash = (53 * hash) + getExp().hashCode();
    if (hasData()) {
      hash = (37 * hash) + DATA_FIELD_NUMBER;
      hash = (53 * hash) + getData().hashCode();
    }
    hash = (29 * hash) + unknownFields.hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static com.acme.UpdateExperimentServiceRequest parseFrom(
      java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(
      java.nio.ByteBuffer data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(
      byte[] data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.UpdateExperimentServiceRequest parseDelimitedFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input);
  }
  public static com.acme.UpdateExperimentServiceRequest parseDelimitedFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(
      com.google.protobuf.CodedInputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.UpdateExperimentServiceRequest parseFrom(
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
  public static Builder newBuilder(com.acme.UpdateExperimentServiceRequest prototype) {
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
   * Protobuf type {@code bundled.UpdateExperimentServiceRequest}
   */
  public static final class Builder extends
      com.google.protobuf.GeneratedMessageV3.Builder<Builder> implements
      // @@protoc_insertion_point(builder_implements:bundled.UpdateExperimentServiceRequest)
      com.acme.UpdateExperimentServiceRequestOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor
        getDescriptor() {
      return com.acme.AnyProto.internal_static_bundled_UpdateExperimentServiceRequest_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return com.acme.AnyProto.internal_static_bundled_UpdateExperimentServiceRequest_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              com.acme.UpdateExperimentServiceRequest.class, com.acme.UpdateExperimentServiceRequest.Builder.class);
    }

    // Construct using com.acme.UpdateExperimentServiceRequest.newBuilder()
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
      exp_ = "";

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
      return com.acme.AnyProto.internal_static_bundled_UpdateExperimentServiceRequest_descriptor;
    }

    @java.lang.Override
    public com.acme.UpdateExperimentServiceRequest getDefaultInstanceForType() {
      return com.acme.UpdateExperimentServiceRequest.getDefaultInstance();
    }

    @java.lang.Override
    public com.acme.UpdateExperimentServiceRequest build() {
      com.acme.UpdateExperimentServiceRequest result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public com.acme.UpdateExperimentServiceRequest buildPartial() {
      com.acme.UpdateExperimentServiceRequest result = new com.acme.UpdateExperimentServiceRequest(this);
      result.exp_ = exp_;
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
      if (other instanceof com.acme.UpdateExperimentServiceRequest) {
        return mergeFrom((com.acme.UpdateExperimentServiceRequest)other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(com.acme.UpdateExperimentServiceRequest other) {
      if (other == com.acme.UpdateExperimentServiceRequest.getDefaultInstance()) return this;
      if (!other.getExp().isEmpty()) {
        exp_ = other.exp_;
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
      com.acme.UpdateExperimentServiceRequest parsedMessage = null;
      try {
        parsedMessage = PARSER.parsePartialFrom(input, extensionRegistry);
      } catch (com.google.protobuf.InvalidProtocolBufferException e) {
        parsedMessage = (com.acme.UpdateExperimentServiceRequest) e.getUnfinishedMessage();
        throw e.unwrapIOException();
      } finally {
        if (parsedMessage != null) {
          mergeFrom(parsedMessage);
        }
      }
      return this;
    }

    private java.lang.Object exp_ = "";
    /**
     * <code>string exp = 1;</code>
     */
    public java.lang.String getExp() {
      java.lang.Object ref = exp_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs =
            (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        exp_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <code>string exp = 1;</code>
     */
    public com.google.protobuf.ByteString
        getExpBytes() {
      java.lang.Object ref = exp_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b = 
            com.google.protobuf.ByteString.copyFromUtf8(
                (java.lang.String) ref);
        exp_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <code>string exp = 1;</code>
     */
    public Builder setExp(
        java.lang.String value) {
      if (value == null) {
    throw new NullPointerException();
  }
  
      exp_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>string exp = 1;</code>
     */
    public Builder clearExp() {
      
      exp_ = getDefaultInstance().getExp();
      onChanged();
      return this;
    }
    /**
     * <code>string exp = 1;</code>
     */
    public Builder setExpBytes(
        com.google.protobuf.ByteString value) {
      if (value == null) {
    throw new NullPointerException();
  }
  checkByteStringIsUtf8(value);
      
      exp_ = value;
      onChanged();
      return this;
    }

    private com.acme.Experiment data_;
    private com.google.protobuf.SingleFieldBuilderV3<
        com.acme.Experiment, com.acme.Experiment.Builder, com.acme.ExperimentOrBuilder> dataBuilder_;
    /**
     * <code>.bundled.Experiment data = 2;</code>
     */
    public boolean hasData() {
      return dataBuilder_ != null || data_ != null;
    }
    /**
     * <code>.bundled.Experiment data = 2;</code>
     */
    public com.acme.Experiment getData() {
      if (dataBuilder_ == null) {
        return data_ == null ? com.acme.Experiment.getDefaultInstance() : data_;
      } else {
        return dataBuilder_.getMessage();
      }
    }
    /**
     * <code>.bundled.Experiment data = 2;</code>
     */
    public Builder setData(com.acme.Experiment value) {
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
     * <code>.bundled.Experiment data = 2;</code>
     */
    public Builder setData(
        com.acme.Experiment.Builder builderForValue) {
      if (dataBuilder_ == null) {
        data_ = builderForValue.build();
        onChanged();
      } else {
        dataBuilder_.setMessage(builderForValue.build());
      }

      return this;
    }
    /**
     * <code>.bundled.Experiment data = 2;</code>
     */
    public Builder mergeData(com.acme.Experiment value) {
      if (dataBuilder_ == null) {
        if (data_ != null) {
          data_ =
            com.acme.Experiment.newBuilder(data_).mergeFrom(value).buildPartial();
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
     * <code>.bundled.Experiment data = 2;</code>
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
     * <code>.bundled.Experiment data = 2;</code>
     */
    public com.acme.Experiment.Builder getDataBuilder() {
      
      onChanged();
      return getDataFieldBuilder().getBuilder();
    }
    /**
     * <code>.bundled.Experiment data = 2;</code>
     */
    public com.acme.ExperimentOrBuilder getDataOrBuilder() {
      if (dataBuilder_ != null) {
        return dataBuilder_.getMessageOrBuilder();
      } else {
        return data_ == null ?
            com.acme.Experiment.getDefaultInstance() : data_;
      }
    }
    /**
     * <code>.bundled.Experiment data = 2;</code>
     */
    private com.google.protobuf.SingleFieldBuilderV3<
        com.acme.Experiment, com.acme.Experiment.Builder, com.acme.ExperimentOrBuilder> 
        getDataFieldBuilder() {
      if (dataBuilder_ == null) {
        dataBuilder_ = new com.google.protobuf.SingleFieldBuilderV3<
            com.acme.Experiment, com.acme.Experiment.Builder, com.acme.ExperimentOrBuilder>(
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


    // @@protoc_insertion_point(builder_scope:bundled.UpdateExperimentServiceRequest)
  }

  // @@protoc_insertion_point(class_scope:bundled.UpdateExperimentServiceRequest)
  private static final com.acme.UpdateExperimentServiceRequest DEFAULT_INSTANCE;
  static {
    DEFAULT_INSTANCE = new com.acme.UpdateExperimentServiceRequest();
  }

  public static com.acme.UpdateExperimentServiceRequest getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<UpdateExperimentServiceRequest>
      PARSER = new com.google.protobuf.AbstractParser<UpdateExperimentServiceRequest>() {
    @java.lang.Override
    public UpdateExperimentServiceRequest parsePartialFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws com.google.protobuf.InvalidProtocolBufferException {
      return new UpdateExperimentServiceRequest(input, extensionRegistry);
    }
  };

  public static com.google.protobuf.Parser<UpdateExperimentServiceRequest> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<UpdateExperimentServiceRequest> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public com.acme.UpdateExperimentServiceRequest getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }

}

