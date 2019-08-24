// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: BundledService.proto

package com.acme;

/**
 * <pre>
 * PersonEntity with Person
 * </pre>
 *
 * Protobuf type {@code bundled.PersonEntity}
 */
public  final class PersonEntity extends
    com.google.protobuf.GeneratedMessageV3 implements
    // @@protoc_insertion_point(message_implements:bundled.PersonEntity)
    PersonEntityOrBuilder {
private static final long serialVersionUID = 0L;
  // Use PersonEntity.newBuilder() to construct.
  private PersonEntity(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }
  private PersonEntity() {
    links_ = java.util.Collections.emptyList();
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet
  getUnknownFields() {
    return this.unknownFields;
  }
  private PersonEntity(
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
            com.acme.Person.Builder subBuilder = null;
            if (data_ != null) {
              subBuilder = data_.toBuilder();
            }
            data_ = input.readMessage(com.acme.Person.parser(), extensionRegistry);
            if (subBuilder != null) {
              subBuilder.mergeFrom(data_);
              data_ = subBuilder.buildPartial();
            }

            break;
          }
          case 18: {
            if (!((mutable_bitField0_ & 0x00000002) != 0)) {
              links_ = new java.util.ArrayList<furo.LinkOuterClass.Link>();
              mutable_bitField0_ |= 0x00000002;
            }
            links_.add(
                input.readMessage(furo.LinkOuterClass.Link.parser(), extensionRegistry));
            break;
          }
          case 26: {
            furo.MetaOuterClass.Meta.Builder subBuilder = null;
            if (meta_ != null) {
              subBuilder = meta_.toBuilder();
            }
            meta_ = input.readMessage(furo.MetaOuterClass.Meta.parser(), extensionRegistry);
            if (subBuilder != null) {
              subBuilder.mergeFrom(meta_);
              meta_ = subBuilder.buildPartial();
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
      if (((mutable_bitField0_ & 0x00000002) != 0)) {
        links_ = java.util.Collections.unmodifiableList(links_);
      }
      this.unknownFields = unknownFields.build();
      makeExtensionsImmutable();
    }
  }
  public static final com.google.protobuf.Descriptors.Descriptor
      getDescriptor() {
    return com.acme.AnyProto.internal_static_bundled_PersonEntity_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return com.acme.AnyProto.internal_static_bundled_PersonEntity_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            com.acme.PersonEntity.class, com.acme.PersonEntity.Builder.class);
  }

  private int bitField0_;
  public static final int DATA_FIELD_NUMBER = 1;
  private com.acme.Person data_;
  /**
   * <pre>
   * contains a person.Person
   * </pre>
   *
   * <code>.bundled.Person data = 1;</code>
   */
  public boolean hasData() {
    return data_ != null;
  }
  /**
   * <pre>
   * contains a person.Person
   * </pre>
   *
   * <code>.bundled.Person data = 1;</code>
   */
  public com.acme.Person getData() {
    return data_ == null ? com.acme.Person.getDefaultInstance() : data_;
  }
  /**
   * <pre>
   * contains a person.Person
   * </pre>
   *
   * <code>.bundled.Person data = 1;</code>
   */
  public com.acme.PersonOrBuilder getDataOrBuilder() {
    return getData();
  }

  public static final int LINKS_FIELD_NUMBER = 2;
  private java.util.List<furo.LinkOuterClass.Link> links_;
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 2;</code>
   */
  public java.util.List<furo.LinkOuterClass.Link> getLinksList() {
    return links_;
  }
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 2;</code>
   */
  public java.util.List<? extends furo.LinkOuterClass.LinkOrBuilder> 
      getLinksOrBuilderList() {
    return links_;
  }
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 2;</code>
   */
  public int getLinksCount() {
    return links_.size();
  }
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 2;</code>
   */
  public furo.LinkOuterClass.Link getLinks(int index) {
    return links_.get(index);
  }
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 2;</code>
   */
  public furo.LinkOuterClass.LinkOrBuilder getLinksOrBuilder(
      int index) {
    return links_.get(index);
  }

  public static final int META_FIELD_NUMBER = 3;
  private furo.MetaOuterClass.Meta meta_;
  /**
   * <pre>
   * Meta for the response
   * </pre>
   *
   * <code>.furo.Meta meta = 3;</code>
   */
  public boolean hasMeta() {
    return meta_ != null;
  }
  /**
   * <pre>
   * Meta for the response
   * </pre>
   *
   * <code>.furo.Meta meta = 3;</code>
   */
  public furo.MetaOuterClass.Meta getMeta() {
    return meta_ == null ? furo.MetaOuterClass.Meta.getDefaultInstance() : meta_;
  }
  /**
   * <pre>
   * Meta for the response
   * </pre>
   *
   * <code>.furo.Meta meta = 3;</code>
   */
  public furo.MetaOuterClass.MetaOrBuilder getMetaOrBuilder() {
    return getMeta();
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
    if (data_ != null) {
      output.writeMessage(1, getData());
    }
    for (int i = 0; i < links_.size(); i++) {
      output.writeMessage(2, links_.get(i));
    }
    if (meta_ != null) {
      output.writeMessage(3, getMeta());
    }
    unknownFields.writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (data_ != null) {
      size += com.google.protobuf.CodedOutputStream
        .computeMessageSize(1, getData());
    }
    for (int i = 0; i < links_.size(); i++) {
      size += com.google.protobuf.CodedOutputStream
        .computeMessageSize(2, links_.get(i));
    }
    if (meta_ != null) {
      size += com.google.protobuf.CodedOutputStream
        .computeMessageSize(3, getMeta());
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
    if (!(obj instanceof com.acme.PersonEntity)) {
      return super.equals(obj);
    }
    com.acme.PersonEntity other = (com.acme.PersonEntity) obj;

    if (hasData() != other.hasData()) return false;
    if (hasData()) {
      if (!getData()
          .equals(other.getData())) return false;
    }
    if (!getLinksList()
        .equals(other.getLinksList())) return false;
    if (hasMeta() != other.hasMeta()) return false;
    if (hasMeta()) {
      if (!getMeta()
          .equals(other.getMeta())) return false;
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
    if (hasData()) {
      hash = (37 * hash) + DATA_FIELD_NUMBER;
      hash = (53 * hash) + getData().hashCode();
    }
    if (getLinksCount() > 0) {
      hash = (37 * hash) + LINKS_FIELD_NUMBER;
      hash = (53 * hash) + getLinksList().hashCode();
    }
    if (hasMeta()) {
      hash = (37 * hash) + META_FIELD_NUMBER;
      hash = (53 * hash) + getMeta().hashCode();
    }
    hash = (29 * hash) + unknownFields.hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static com.acme.PersonEntity parseFrom(
      java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.PersonEntity parseFrom(
      java.nio.ByteBuffer data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.PersonEntity parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.PersonEntity parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.PersonEntity parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.PersonEntity parseFrom(
      byte[] data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.PersonEntity parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.PersonEntity parseFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.PersonEntity parseDelimitedFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input);
  }
  public static com.acme.PersonEntity parseDelimitedFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.PersonEntity parseFrom(
      com.google.protobuf.CodedInputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.PersonEntity parseFrom(
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
  public static Builder newBuilder(com.acme.PersonEntity prototype) {
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
   * <pre>
   * PersonEntity with Person
   * </pre>
   *
   * Protobuf type {@code bundled.PersonEntity}
   */
  public static final class Builder extends
      com.google.protobuf.GeneratedMessageV3.Builder<Builder> implements
      // @@protoc_insertion_point(builder_implements:bundled.PersonEntity)
      com.acme.PersonEntityOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor
        getDescriptor() {
      return com.acme.AnyProto.internal_static_bundled_PersonEntity_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return com.acme.AnyProto.internal_static_bundled_PersonEntity_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              com.acme.PersonEntity.class, com.acme.PersonEntity.Builder.class);
    }

    // Construct using com.acme.PersonEntity.newBuilder()
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
        getLinksFieldBuilder();
      }
    }
    @java.lang.Override
    public Builder clear() {
      super.clear();
      if (dataBuilder_ == null) {
        data_ = null;
      } else {
        data_ = null;
        dataBuilder_ = null;
      }
      if (linksBuilder_ == null) {
        links_ = java.util.Collections.emptyList();
        bitField0_ = (bitField0_ & ~0x00000002);
      } else {
        linksBuilder_.clear();
      }
      if (metaBuilder_ == null) {
        meta_ = null;
      } else {
        meta_ = null;
        metaBuilder_ = null;
      }
      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor
        getDescriptorForType() {
      return com.acme.AnyProto.internal_static_bundled_PersonEntity_descriptor;
    }

    @java.lang.Override
    public com.acme.PersonEntity getDefaultInstanceForType() {
      return com.acme.PersonEntity.getDefaultInstance();
    }

    @java.lang.Override
    public com.acme.PersonEntity build() {
      com.acme.PersonEntity result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public com.acme.PersonEntity buildPartial() {
      com.acme.PersonEntity result = new com.acme.PersonEntity(this);
      int from_bitField0_ = bitField0_;
      int to_bitField0_ = 0;
      if (dataBuilder_ == null) {
        result.data_ = data_;
      } else {
        result.data_ = dataBuilder_.build();
      }
      if (linksBuilder_ == null) {
        if (((bitField0_ & 0x00000002) != 0)) {
          links_ = java.util.Collections.unmodifiableList(links_);
          bitField0_ = (bitField0_ & ~0x00000002);
        }
        result.links_ = links_;
      } else {
        result.links_ = linksBuilder_.build();
      }
      if (metaBuilder_ == null) {
        result.meta_ = meta_;
      } else {
        result.meta_ = metaBuilder_.build();
      }
      result.bitField0_ = to_bitField0_;
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
      if (other instanceof com.acme.PersonEntity) {
        return mergeFrom((com.acme.PersonEntity)other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(com.acme.PersonEntity other) {
      if (other == com.acme.PersonEntity.getDefaultInstance()) return this;
      if (other.hasData()) {
        mergeData(other.getData());
      }
      if (linksBuilder_ == null) {
        if (!other.links_.isEmpty()) {
          if (links_.isEmpty()) {
            links_ = other.links_;
            bitField0_ = (bitField0_ & ~0x00000002);
          } else {
            ensureLinksIsMutable();
            links_.addAll(other.links_);
          }
          onChanged();
        }
      } else {
        if (!other.links_.isEmpty()) {
          if (linksBuilder_.isEmpty()) {
            linksBuilder_.dispose();
            linksBuilder_ = null;
            links_ = other.links_;
            bitField0_ = (bitField0_ & ~0x00000002);
            linksBuilder_ = 
              com.google.protobuf.GeneratedMessageV3.alwaysUseFieldBuilders ?
                 getLinksFieldBuilder() : null;
          } else {
            linksBuilder_.addAllMessages(other.links_);
          }
        }
      }
      if (other.hasMeta()) {
        mergeMeta(other.getMeta());
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
      com.acme.PersonEntity parsedMessage = null;
      try {
        parsedMessage = PARSER.parsePartialFrom(input, extensionRegistry);
      } catch (com.google.protobuf.InvalidProtocolBufferException e) {
        parsedMessage = (com.acme.PersonEntity) e.getUnfinishedMessage();
        throw e.unwrapIOException();
      } finally {
        if (parsedMessage != null) {
          mergeFrom(parsedMessage);
        }
      }
      return this;
    }
    private int bitField0_;

    private com.acme.Person data_;
    private com.google.protobuf.SingleFieldBuilderV3<
        com.acme.Person, com.acme.Person.Builder, com.acme.PersonOrBuilder> dataBuilder_;
    /**
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    public boolean hasData() {
      return dataBuilder_ != null || data_ != null;
    }
    /**
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    public com.acme.Person getData() {
      if (dataBuilder_ == null) {
        return data_ == null ? com.acme.Person.getDefaultInstance() : data_;
      } else {
        return dataBuilder_.getMessage();
      }
    }
    /**
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    public Builder setData(com.acme.Person value) {
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
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    public Builder setData(
        com.acme.Person.Builder builderForValue) {
      if (dataBuilder_ == null) {
        data_ = builderForValue.build();
        onChanged();
      } else {
        dataBuilder_.setMessage(builderForValue.build());
      }

      return this;
    }
    /**
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    public Builder mergeData(com.acme.Person value) {
      if (dataBuilder_ == null) {
        if (data_ != null) {
          data_ =
            com.acme.Person.newBuilder(data_).mergeFrom(value).buildPartial();
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
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
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
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    public com.acme.Person.Builder getDataBuilder() {
      
      onChanged();
      return getDataFieldBuilder().getBuilder();
    }
    /**
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    public com.acme.PersonOrBuilder getDataOrBuilder() {
      if (dataBuilder_ != null) {
        return dataBuilder_.getMessageOrBuilder();
      } else {
        return data_ == null ?
            com.acme.Person.getDefaultInstance() : data_;
      }
    }
    /**
     * <pre>
     * contains a person.Person
     * </pre>
     *
     * <code>.bundled.Person data = 1;</code>
     */
    private com.google.protobuf.SingleFieldBuilderV3<
        com.acme.Person, com.acme.Person.Builder, com.acme.PersonOrBuilder> 
        getDataFieldBuilder() {
      if (dataBuilder_ == null) {
        dataBuilder_ = new com.google.protobuf.SingleFieldBuilderV3<
            com.acme.Person, com.acme.Person.Builder, com.acme.PersonOrBuilder>(
                getData(),
                getParentForChildren(),
                isClean());
        data_ = null;
      }
      return dataBuilder_;
    }

    private java.util.List<furo.LinkOuterClass.Link> links_ =
      java.util.Collections.emptyList();
    private void ensureLinksIsMutable() {
      if (!((bitField0_ & 0x00000002) != 0)) {
        links_ = new java.util.ArrayList<furo.LinkOuterClass.Link>(links_);
        bitField0_ |= 0x00000002;
       }
    }

    private com.google.protobuf.RepeatedFieldBuilderV3<
        furo.LinkOuterClass.Link, furo.LinkOuterClass.Link.Builder, furo.LinkOuterClass.LinkOrBuilder> linksBuilder_;

    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public java.util.List<furo.LinkOuterClass.Link> getLinksList() {
      if (linksBuilder_ == null) {
        return java.util.Collections.unmodifiableList(links_);
      } else {
        return linksBuilder_.getMessageList();
      }
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public int getLinksCount() {
      if (linksBuilder_ == null) {
        return links_.size();
      } else {
        return linksBuilder_.getCount();
      }
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public furo.LinkOuterClass.Link getLinks(int index) {
      if (linksBuilder_ == null) {
        return links_.get(index);
      } else {
        return linksBuilder_.getMessage(index);
      }
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder setLinks(
        int index, furo.LinkOuterClass.Link value) {
      if (linksBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        ensureLinksIsMutable();
        links_.set(index, value);
        onChanged();
      } else {
        linksBuilder_.setMessage(index, value);
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder setLinks(
        int index, furo.LinkOuterClass.Link.Builder builderForValue) {
      if (linksBuilder_ == null) {
        ensureLinksIsMutable();
        links_.set(index, builderForValue.build());
        onChanged();
      } else {
        linksBuilder_.setMessage(index, builderForValue.build());
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder addLinks(furo.LinkOuterClass.Link value) {
      if (linksBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        ensureLinksIsMutable();
        links_.add(value);
        onChanged();
      } else {
        linksBuilder_.addMessage(value);
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder addLinks(
        int index, furo.LinkOuterClass.Link value) {
      if (linksBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        ensureLinksIsMutable();
        links_.add(index, value);
        onChanged();
      } else {
        linksBuilder_.addMessage(index, value);
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder addLinks(
        furo.LinkOuterClass.Link.Builder builderForValue) {
      if (linksBuilder_ == null) {
        ensureLinksIsMutable();
        links_.add(builderForValue.build());
        onChanged();
      } else {
        linksBuilder_.addMessage(builderForValue.build());
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder addLinks(
        int index, furo.LinkOuterClass.Link.Builder builderForValue) {
      if (linksBuilder_ == null) {
        ensureLinksIsMutable();
        links_.add(index, builderForValue.build());
        onChanged();
      } else {
        linksBuilder_.addMessage(index, builderForValue.build());
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder addAllLinks(
        java.lang.Iterable<? extends furo.LinkOuterClass.Link> values) {
      if (linksBuilder_ == null) {
        ensureLinksIsMutable();
        com.google.protobuf.AbstractMessageLite.Builder.addAll(
            values, links_);
        onChanged();
      } else {
        linksBuilder_.addAllMessages(values);
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder clearLinks() {
      if (linksBuilder_ == null) {
        links_ = java.util.Collections.emptyList();
        bitField0_ = (bitField0_ & ~0x00000002);
        onChanged();
      } else {
        linksBuilder_.clear();
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public Builder removeLinks(int index) {
      if (linksBuilder_ == null) {
        ensureLinksIsMutable();
        links_.remove(index);
        onChanged();
      } else {
        linksBuilder_.remove(index);
      }
      return this;
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public furo.LinkOuterClass.Link.Builder getLinksBuilder(
        int index) {
      return getLinksFieldBuilder().getBuilder(index);
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public furo.LinkOuterClass.LinkOrBuilder getLinksOrBuilder(
        int index) {
      if (linksBuilder_ == null) {
        return links_.get(index);  } else {
        return linksBuilder_.getMessageOrBuilder(index);
      }
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public java.util.List<? extends furo.LinkOuterClass.LinkOrBuilder> 
         getLinksOrBuilderList() {
      if (linksBuilder_ != null) {
        return linksBuilder_.getMessageOrBuilderList();
      } else {
        return java.util.Collections.unmodifiableList(links_);
      }
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public furo.LinkOuterClass.Link.Builder addLinksBuilder() {
      return getLinksFieldBuilder().addBuilder(
          furo.LinkOuterClass.Link.getDefaultInstance());
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public furo.LinkOuterClass.Link.Builder addLinksBuilder(
        int index) {
      return getLinksFieldBuilder().addBuilder(
          index, furo.LinkOuterClass.Link.getDefaultInstance());
    }
    /**
     * <pre>
     * Hateoas links
     * </pre>
     *
     * <code>repeated .furo.Link links = 2;</code>
     */
    public java.util.List<furo.LinkOuterClass.Link.Builder> 
         getLinksBuilderList() {
      return getLinksFieldBuilder().getBuilderList();
    }
    private com.google.protobuf.RepeatedFieldBuilderV3<
        furo.LinkOuterClass.Link, furo.LinkOuterClass.Link.Builder, furo.LinkOuterClass.LinkOrBuilder> 
        getLinksFieldBuilder() {
      if (linksBuilder_ == null) {
        linksBuilder_ = new com.google.protobuf.RepeatedFieldBuilderV3<
            furo.LinkOuterClass.Link, furo.LinkOuterClass.Link.Builder, furo.LinkOuterClass.LinkOrBuilder>(
                links_,
                ((bitField0_ & 0x00000002) != 0),
                getParentForChildren(),
                isClean());
        links_ = null;
      }
      return linksBuilder_;
    }

    private furo.MetaOuterClass.Meta meta_;
    private com.google.protobuf.SingleFieldBuilderV3<
        furo.MetaOuterClass.Meta, furo.MetaOuterClass.Meta.Builder, furo.MetaOuterClass.MetaOrBuilder> metaBuilder_;
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public boolean hasMeta() {
      return metaBuilder_ != null || meta_ != null;
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public furo.MetaOuterClass.Meta getMeta() {
      if (metaBuilder_ == null) {
        return meta_ == null ? furo.MetaOuterClass.Meta.getDefaultInstance() : meta_;
      } else {
        return metaBuilder_.getMessage();
      }
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public Builder setMeta(furo.MetaOuterClass.Meta value) {
      if (metaBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        meta_ = value;
        onChanged();
      } else {
        metaBuilder_.setMessage(value);
      }

      return this;
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public Builder setMeta(
        furo.MetaOuterClass.Meta.Builder builderForValue) {
      if (metaBuilder_ == null) {
        meta_ = builderForValue.build();
        onChanged();
      } else {
        metaBuilder_.setMessage(builderForValue.build());
      }

      return this;
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public Builder mergeMeta(furo.MetaOuterClass.Meta value) {
      if (metaBuilder_ == null) {
        if (meta_ != null) {
          meta_ =
            furo.MetaOuterClass.Meta.newBuilder(meta_).mergeFrom(value).buildPartial();
        } else {
          meta_ = value;
        }
        onChanged();
      } else {
        metaBuilder_.mergeFrom(value);
      }

      return this;
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public Builder clearMeta() {
      if (metaBuilder_ == null) {
        meta_ = null;
        onChanged();
      } else {
        meta_ = null;
        metaBuilder_ = null;
      }

      return this;
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public furo.MetaOuterClass.Meta.Builder getMetaBuilder() {
      
      onChanged();
      return getMetaFieldBuilder().getBuilder();
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    public furo.MetaOuterClass.MetaOrBuilder getMetaOrBuilder() {
      if (metaBuilder_ != null) {
        return metaBuilder_.getMessageOrBuilder();
      } else {
        return meta_ == null ?
            furo.MetaOuterClass.Meta.getDefaultInstance() : meta_;
      }
    }
    /**
     * <pre>
     * Meta for the response
     * </pre>
     *
     * <code>.furo.Meta meta = 3;</code>
     */
    private com.google.protobuf.SingleFieldBuilderV3<
        furo.MetaOuterClass.Meta, furo.MetaOuterClass.Meta.Builder, furo.MetaOuterClass.MetaOrBuilder> 
        getMetaFieldBuilder() {
      if (metaBuilder_ == null) {
        metaBuilder_ = new com.google.protobuf.SingleFieldBuilderV3<
            furo.MetaOuterClass.Meta, furo.MetaOuterClass.Meta.Builder, furo.MetaOuterClass.MetaOrBuilder>(
                getMeta(),
                getParentForChildren(),
                isClean());
        meta_ = null;
      }
      return metaBuilder_;
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


    // @@protoc_insertion_point(builder_scope:bundled.PersonEntity)
  }

  // @@protoc_insertion_point(class_scope:bundled.PersonEntity)
  private static final com.acme.PersonEntity DEFAULT_INSTANCE;
  static {
    DEFAULT_INSTANCE = new com.acme.PersonEntity();
  }

  public static com.acme.PersonEntity getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<PersonEntity>
      PARSER = new com.google.protobuf.AbstractParser<PersonEntity>() {
    @java.lang.Override
    public PersonEntity parsePartialFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws com.google.protobuf.InvalidProtocolBufferException {
      return new PersonEntity(input, extensionRegistry);
    }
  };

  public static com.google.protobuf.Parser<PersonEntity> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<PersonEntity> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public com.acme.PersonEntity getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }

}

