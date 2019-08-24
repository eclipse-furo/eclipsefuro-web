// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: BundledService.proto

package com.acme;

/**
 * <pre>
 * experiment spec for testing
 * </pre>
 *
 * Protobuf type {@code bundled.Experiment}
 */
public  final class Experiment extends
    com.google.protobuf.GeneratedMessageV3 implements
    // @@protoc_insertion_point(message_implements:bundled.Experiment)
    ExperimentOrBuilder {
private static final long serialVersionUID = 0L;
  // Use Experiment.newBuilder() to construct.
  private Experiment(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }
  private Experiment() {
    description_ = "";
    displayName_ = "";
    furoDataTextInput_ = "";
    id_ = "";
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet
  getUnknownFields() {
    return this.unknownFields;
  }
  private Experiment(
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

            id_ = s;
            break;
          }
          case 18: {
            java.lang.String s = input.readStringRequireUtf8();

            displayName_ = s;
            break;
          }
          case 26: {
            java.lang.String s = input.readStringRequireUtf8();

            description_ = s;
            break;
          }
          case 32: {

            furoDataCheckboxInput_ = input.readInt32();
            break;
          }
          case 42: {
            java.lang.String s = input.readStringRequireUtf8();

            furoDataTextInput_ = s;
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
    return com.acme.AnyProto.internal_static_bundled_Experiment_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return com.acme.AnyProto.internal_static_bundled_Experiment_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            com.acme.Experiment.class, com.acme.Experiment.Builder.class);
  }

  public static final int DESCRIPTION_FIELD_NUMBER = 3;
  private volatile java.lang.Object description_;
  /**
   * <pre>
   * Short experiment description
   * </pre>
   *
   * <code>string description = 3;</code>
   */
  public java.lang.String getDescription() {
    java.lang.Object ref = description_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = 
          (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      description_ = s;
      return s;
    }
  }
  /**
   * <pre>
   * Short experiment description
   * </pre>
   *
   * <code>string description = 3;</code>
   */
  public com.google.protobuf.ByteString
      getDescriptionBytes() {
    java.lang.Object ref = description_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b = 
          com.google.protobuf.ByteString.copyFromUtf8(
              (java.lang.String) ref);
      description_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int DISPLAY_NAME_FIELD_NUMBER = 2;
  private volatile java.lang.Object displayName_;
  /**
   * <pre>
   * Localized String representation of a experiment
   * </pre>
   *
   * <code>string display_name = 2;</code>
   */
  public java.lang.String getDisplayName() {
    java.lang.Object ref = displayName_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = 
          (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      displayName_ = s;
      return s;
    }
  }
  /**
   * <pre>
   * Localized String representation of a experiment
   * </pre>
   *
   * <code>string display_name = 2;</code>
   */
  public com.google.protobuf.ByteString
      getDisplayNameBytes() {
    java.lang.Object ref = displayName_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b = 
          com.google.protobuf.ByteString.copyFromUtf8(
              (java.lang.String) ref);
      displayName_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int FURO_DATA_CHECKBOX_INPUT_FIELD_NUMBER = 4;
  private int furoDataCheckboxInput_;
  /**
   * <pre>
   * field for furo_data_checkbox_input for testing
   * </pre>
   *
   * <code>int32 furo_data_checkbox_input = 4;</code>
   */
  public int getFuroDataCheckboxInput() {
    return furoDataCheckboxInput_;
  }

  public static final int FURO_DATA_TEXT_INPUT_FIELD_NUMBER = 5;
  private volatile java.lang.Object furoDataTextInput_;
  /**
   * <pre>
   * field for furo_data_text_input for testing
   * </pre>
   *
   * <code>string furo_data_text_input = 5;</code>
   */
  public java.lang.String getFuroDataTextInput() {
    java.lang.Object ref = furoDataTextInput_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = 
          (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      furoDataTextInput_ = s;
      return s;
    }
  }
  /**
   * <pre>
   * field for furo_data_text_input for testing
   * </pre>
   *
   * <code>string furo_data_text_input = 5;</code>
   */
  public com.google.protobuf.ByteString
      getFuroDataTextInputBytes() {
    java.lang.Object ref = furoDataTextInput_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b = 
          com.google.protobuf.ByteString.copyFromUtf8(
              (java.lang.String) ref);
      furoDataTextInput_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
  }

  public static final int ID_FIELD_NUMBER = 1;
  private volatile java.lang.Object id_;
  /**
   * <pre>
   * Identity of a experiment
   * </pre>
   *
   * <code>string id = 1;</code>
   */
  public java.lang.String getId() {
    java.lang.Object ref = id_;
    if (ref instanceof java.lang.String) {
      return (java.lang.String) ref;
    } else {
      com.google.protobuf.ByteString bs = 
          (com.google.protobuf.ByteString) ref;
      java.lang.String s = bs.toStringUtf8();
      id_ = s;
      return s;
    }
  }
  /**
   * <pre>
   * Identity of a experiment
   * </pre>
   *
   * <code>string id = 1;</code>
   */
  public com.google.protobuf.ByteString
      getIdBytes() {
    java.lang.Object ref = id_;
    if (ref instanceof java.lang.String) {
      com.google.protobuf.ByteString b = 
          com.google.protobuf.ByteString.copyFromUtf8(
              (java.lang.String) ref);
      id_ = b;
      return b;
    } else {
      return (com.google.protobuf.ByteString) ref;
    }
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
    if (!getIdBytes().isEmpty()) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 1, id_);
    }
    if (!getDisplayNameBytes().isEmpty()) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 2, displayName_);
    }
    if (!getDescriptionBytes().isEmpty()) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 3, description_);
    }
    if (furoDataCheckboxInput_ != 0) {
      output.writeInt32(4, furoDataCheckboxInput_);
    }
    if (!getFuroDataTextInputBytes().isEmpty()) {
      com.google.protobuf.GeneratedMessageV3.writeString(output, 5, furoDataTextInput_);
    }
    unknownFields.writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (!getIdBytes().isEmpty()) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(1, id_);
    }
    if (!getDisplayNameBytes().isEmpty()) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(2, displayName_);
    }
    if (!getDescriptionBytes().isEmpty()) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(3, description_);
    }
    if (furoDataCheckboxInput_ != 0) {
      size += com.google.protobuf.CodedOutputStream
        .computeInt32Size(4, furoDataCheckboxInput_);
    }
    if (!getFuroDataTextInputBytes().isEmpty()) {
      size += com.google.protobuf.GeneratedMessageV3.computeStringSize(5, furoDataTextInput_);
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
    if (!(obj instanceof com.acme.Experiment)) {
      return super.equals(obj);
    }
    com.acme.Experiment other = (com.acme.Experiment) obj;

    if (!getDescription()
        .equals(other.getDescription())) return false;
    if (!getDisplayName()
        .equals(other.getDisplayName())) return false;
    if (getFuroDataCheckboxInput()
        != other.getFuroDataCheckboxInput()) return false;
    if (!getFuroDataTextInput()
        .equals(other.getFuroDataTextInput())) return false;
    if (!getId()
        .equals(other.getId())) return false;
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
    hash = (37 * hash) + DESCRIPTION_FIELD_NUMBER;
    hash = (53 * hash) + getDescription().hashCode();
    hash = (37 * hash) + DISPLAY_NAME_FIELD_NUMBER;
    hash = (53 * hash) + getDisplayName().hashCode();
    hash = (37 * hash) + FURO_DATA_CHECKBOX_INPUT_FIELD_NUMBER;
    hash = (53 * hash) + getFuroDataCheckboxInput();
    hash = (37 * hash) + FURO_DATA_TEXT_INPUT_FIELD_NUMBER;
    hash = (53 * hash) + getFuroDataTextInput().hashCode();
    hash = (37 * hash) + ID_FIELD_NUMBER;
    hash = (53 * hash) + getId().hashCode();
    hash = (29 * hash) + unknownFields.hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static com.acme.Experiment parseFrom(
      java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.Experiment parseFrom(
      java.nio.ByteBuffer data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.Experiment parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.Experiment parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.Experiment parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static com.acme.Experiment parseFrom(
      byte[] data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static com.acme.Experiment parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.Experiment parseFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.Experiment parseDelimitedFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input);
  }
  public static com.acme.Experiment parseDelimitedFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input, extensionRegistry);
  }
  public static com.acme.Experiment parseFrom(
      com.google.protobuf.CodedInputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static com.acme.Experiment parseFrom(
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
  public static Builder newBuilder(com.acme.Experiment prototype) {
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
   * experiment spec for testing
   * </pre>
   *
   * Protobuf type {@code bundled.Experiment}
   */
  public static final class Builder extends
      com.google.protobuf.GeneratedMessageV3.Builder<Builder> implements
      // @@protoc_insertion_point(builder_implements:bundled.Experiment)
      com.acme.ExperimentOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor
        getDescriptor() {
      return com.acme.AnyProto.internal_static_bundled_Experiment_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return com.acme.AnyProto.internal_static_bundled_Experiment_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              com.acme.Experiment.class, com.acme.Experiment.Builder.class);
    }

    // Construct using com.acme.Experiment.newBuilder()
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
      description_ = "";

      displayName_ = "";

      furoDataCheckboxInput_ = 0;

      furoDataTextInput_ = "";

      id_ = "";

      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor
        getDescriptorForType() {
      return com.acme.AnyProto.internal_static_bundled_Experiment_descriptor;
    }

    @java.lang.Override
    public com.acme.Experiment getDefaultInstanceForType() {
      return com.acme.Experiment.getDefaultInstance();
    }

    @java.lang.Override
    public com.acme.Experiment build() {
      com.acme.Experiment result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public com.acme.Experiment buildPartial() {
      com.acme.Experiment result = new com.acme.Experiment(this);
      result.description_ = description_;
      result.displayName_ = displayName_;
      result.furoDataCheckboxInput_ = furoDataCheckboxInput_;
      result.furoDataTextInput_ = furoDataTextInput_;
      result.id_ = id_;
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
      if (other instanceof com.acme.Experiment) {
        return mergeFrom((com.acme.Experiment)other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(com.acme.Experiment other) {
      if (other == com.acme.Experiment.getDefaultInstance()) return this;
      if (!other.getDescription().isEmpty()) {
        description_ = other.description_;
        onChanged();
      }
      if (!other.getDisplayName().isEmpty()) {
        displayName_ = other.displayName_;
        onChanged();
      }
      if (other.getFuroDataCheckboxInput() != 0) {
        setFuroDataCheckboxInput(other.getFuroDataCheckboxInput());
      }
      if (!other.getFuroDataTextInput().isEmpty()) {
        furoDataTextInput_ = other.furoDataTextInput_;
        onChanged();
      }
      if (!other.getId().isEmpty()) {
        id_ = other.id_;
        onChanged();
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
      com.acme.Experiment parsedMessage = null;
      try {
        parsedMessage = PARSER.parsePartialFrom(input, extensionRegistry);
      } catch (com.google.protobuf.InvalidProtocolBufferException e) {
        parsedMessage = (com.acme.Experiment) e.getUnfinishedMessage();
        throw e.unwrapIOException();
      } finally {
        if (parsedMessage != null) {
          mergeFrom(parsedMessage);
        }
      }
      return this;
    }

    private java.lang.Object description_ = "";
    /**
     * <pre>
     * Short experiment description
     * </pre>
     *
     * <code>string description = 3;</code>
     */
    public java.lang.String getDescription() {
      java.lang.Object ref = description_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs =
            (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        description_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <pre>
     * Short experiment description
     * </pre>
     *
     * <code>string description = 3;</code>
     */
    public com.google.protobuf.ByteString
        getDescriptionBytes() {
      java.lang.Object ref = description_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b = 
            com.google.protobuf.ByteString.copyFromUtf8(
                (java.lang.String) ref);
        description_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <pre>
     * Short experiment description
     * </pre>
     *
     * <code>string description = 3;</code>
     */
    public Builder setDescription(
        java.lang.String value) {
      if (value == null) {
    throw new NullPointerException();
  }
  
      description_ = value;
      onChanged();
      return this;
    }
    /**
     * <pre>
     * Short experiment description
     * </pre>
     *
     * <code>string description = 3;</code>
     */
    public Builder clearDescription() {
      
      description_ = getDefaultInstance().getDescription();
      onChanged();
      return this;
    }
    /**
     * <pre>
     * Short experiment description
     * </pre>
     *
     * <code>string description = 3;</code>
     */
    public Builder setDescriptionBytes(
        com.google.protobuf.ByteString value) {
      if (value == null) {
    throw new NullPointerException();
  }
  checkByteStringIsUtf8(value);
      
      description_ = value;
      onChanged();
      return this;
    }

    private java.lang.Object displayName_ = "";
    /**
     * <pre>
     * Localized String representation of a experiment
     * </pre>
     *
     * <code>string display_name = 2;</code>
     */
    public java.lang.String getDisplayName() {
      java.lang.Object ref = displayName_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs =
            (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        displayName_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <pre>
     * Localized String representation of a experiment
     * </pre>
     *
     * <code>string display_name = 2;</code>
     */
    public com.google.protobuf.ByteString
        getDisplayNameBytes() {
      java.lang.Object ref = displayName_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b = 
            com.google.protobuf.ByteString.copyFromUtf8(
                (java.lang.String) ref);
        displayName_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <pre>
     * Localized String representation of a experiment
     * </pre>
     *
     * <code>string display_name = 2;</code>
     */
    public Builder setDisplayName(
        java.lang.String value) {
      if (value == null) {
    throw new NullPointerException();
  }
  
      displayName_ = value;
      onChanged();
      return this;
    }
    /**
     * <pre>
     * Localized String representation of a experiment
     * </pre>
     *
     * <code>string display_name = 2;</code>
     */
    public Builder clearDisplayName() {
      
      displayName_ = getDefaultInstance().getDisplayName();
      onChanged();
      return this;
    }
    /**
     * <pre>
     * Localized String representation of a experiment
     * </pre>
     *
     * <code>string display_name = 2;</code>
     */
    public Builder setDisplayNameBytes(
        com.google.protobuf.ByteString value) {
      if (value == null) {
    throw new NullPointerException();
  }
  checkByteStringIsUtf8(value);
      
      displayName_ = value;
      onChanged();
      return this;
    }

    private int furoDataCheckboxInput_ ;
    /**
     * <pre>
     * field for furo_data_checkbox_input for testing
     * </pre>
     *
     * <code>int32 furo_data_checkbox_input = 4;</code>
     */
    public int getFuroDataCheckboxInput() {
      return furoDataCheckboxInput_;
    }
    /**
     * <pre>
     * field for furo_data_checkbox_input for testing
     * </pre>
     *
     * <code>int32 furo_data_checkbox_input = 4;</code>
     */
    public Builder setFuroDataCheckboxInput(int value) {
      
      furoDataCheckboxInput_ = value;
      onChanged();
      return this;
    }
    /**
     * <pre>
     * field for furo_data_checkbox_input for testing
     * </pre>
     *
     * <code>int32 furo_data_checkbox_input = 4;</code>
     */
    public Builder clearFuroDataCheckboxInput() {
      
      furoDataCheckboxInput_ = 0;
      onChanged();
      return this;
    }

    private java.lang.Object furoDataTextInput_ = "";
    /**
     * <pre>
     * field for furo_data_text_input for testing
     * </pre>
     *
     * <code>string furo_data_text_input = 5;</code>
     */
    public java.lang.String getFuroDataTextInput() {
      java.lang.Object ref = furoDataTextInput_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs =
            (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        furoDataTextInput_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <pre>
     * field for furo_data_text_input for testing
     * </pre>
     *
     * <code>string furo_data_text_input = 5;</code>
     */
    public com.google.protobuf.ByteString
        getFuroDataTextInputBytes() {
      java.lang.Object ref = furoDataTextInput_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b = 
            com.google.protobuf.ByteString.copyFromUtf8(
                (java.lang.String) ref);
        furoDataTextInput_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <pre>
     * field for furo_data_text_input for testing
     * </pre>
     *
     * <code>string furo_data_text_input = 5;</code>
     */
    public Builder setFuroDataTextInput(
        java.lang.String value) {
      if (value == null) {
    throw new NullPointerException();
  }
  
      furoDataTextInput_ = value;
      onChanged();
      return this;
    }
    /**
     * <pre>
     * field for furo_data_text_input for testing
     * </pre>
     *
     * <code>string furo_data_text_input = 5;</code>
     */
    public Builder clearFuroDataTextInput() {
      
      furoDataTextInput_ = getDefaultInstance().getFuroDataTextInput();
      onChanged();
      return this;
    }
    /**
     * <pre>
     * field for furo_data_text_input for testing
     * </pre>
     *
     * <code>string furo_data_text_input = 5;</code>
     */
    public Builder setFuroDataTextInputBytes(
        com.google.protobuf.ByteString value) {
      if (value == null) {
    throw new NullPointerException();
  }
  checkByteStringIsUtf8(value);
      
      furoDataTextInput_ = value;
      onChanged();
      return this;
    }

    private java.lang.Object id_ = "";
    /**
     * <pre>
     * Identity of a experiment
     * </pre>
     *
     * <code>string id = 1;</code>
     */
    public java.lang.String getId() {
      java.lang.Object ref = id_;
      if (!(ref instanceof java.lang.String)) {
        com.google.protobuf.ByteString bs =
            (com.google.protobuf.ByteString) ref;
        java.lang.String s = bs.toStringUtf8();
        id_ = s;
        return s;
      } else {
        return (java.lang.String) ref;
      }
    }
    /**
     * <pre>
     * Identity of a experiment
     * </pre>
     *
     * <code>string id = 1;</code>
     */
    public com.google.protobuf.ByteString
        getIdBytes() {
      java.lang.Object ref = id_;
      if (ref instanceof String) {
        com.google.protobuf.ByteString b = 
            com.google.protobuf.ByteString.copyFromUtf8(
                (java.lang.String) ref);
        id_ = b;
        return b;
      } else {
        return (com.google.protobuf.ByteString) ref;
      }
    }
    /**
     * <pre>
     * Identity of a experiment
     * </pre>
     *
     * <code>string id = 1;</code>
     */
    public Builder setId(
        java.lang.String value) {
      if (value == null) {
    throw new NullPointerException();
  }
  
      id_ = value;
      onChanged();
      return this;
    }
    /**
     * <pre>
     * Identity of a experiment
     * </pre>
     *
     * <code>string id = 1;</code>
     */
    public Builder clearId() {
      
      id_ = getDefaultInstance().getId();
      onChanged();
      return this;
    }
    /**
     * <pre>
     * Identity of a experiment
     * </pre>
     *
     * <code>string id = 1;</code>
     */
    public Builder setIdBytes(
        com.google.protobuf.ByteString value) {
      if (value == null) {
    throw new NullPointerException();
  }
  checkByteStringIsUtf8(value);
      
      id_ = value;
      onChanged();
      return this;
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


    // @@protoc_insertion_point(builder_scope:bundled.Experiment)
  }

  // @@protoc_insertion_point(class_scope:bundled.Experiment)
  private static final com.acme.Experiment DEFAULT_INSTANCE;
  static {
    DEFAULT_INSTANCE = new com.acme.Experiment();
  }

  public static com.acme.Experiment getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<Experiment>
      PARSER = new com.google.protobuf.AbstractParser<Experiment>() {
    @java.lang.Override
    public Experiment parsePartialFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws com.google.protobuf.InvalidProtocolBufferException {
      return new Experiment(input, extensionRegistry);
    }
  };

  public static com.google.protobuf.Parser<Experiment> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<Experiment> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public com.acme.Experiment getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }

}

