// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: BundledService.proto

package com.acme;

public interface TreeCollectionOrBuilder extends
    // @@protoc_insertion_point(interface_extends:bundled.TreeCollection)
    com.google.protobuf.MessageOrBuilder {

  /**
   * <pre>
   * Contains a tree.TreeEntity repeated
   * </pre>
   *
   * <code>repeated .bundled.TreeEntity entities = 4;</code>
   */
  java.util.List<com.acme.TreeEntity> 
      getEntitiesList();
  /**
   * <pre>
   * Contains a tree.TreeEntity repeated
   * </pre>
   *
   * <code>repeated .bundled.TreeEntity entities = 4;</code>
   */
  com.acme.TreeEntity getEntities(int index);
  /**
   * <pre>
   * Contains a tree.TreeEntity repeated
   * </pre>
   *
   * <code>repeated .bundled.TreeEntity entities = 4;</code>
   */
  int getEntitiesCount();
  /**
   * <pre>
   * Contains a tree.TreeEntity repeated
   * </pre>
   *
   * <code>repeated .bundled.TreeEntity entities = 4;</code>
   */
  java.util.List<? extends com.acme.TreeEntityOrBuilder> 
      getEntitiesOrBuilderList();
  /**
   * <pre>
   * Contains a tree.TreeEntity repeated
   * </pre>
   *
   * <code>repeated .bundled.TreeEntity entities = 4;</code>
   */
  com.acme.TreeEntityOrBuilder getEntitiesOrBuilder(
      int index);

  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 3;</code>
   */
  java.util.List<furo.LinkOuterClass.Link> 
      getLinksList();
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 3;</code>
   */
  furo.LinkOuterClass.Link getLinks(int index);
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 3;</code>
   */
  int getLinksCount();
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 3;</code>
   */
  java.util.List<? extends furo.LinkOuterClass.LinkOrBuilder> 
      getLinksOrBuilderList();
  /**
   * <pre>
   * Hateoas links
   * </pre>
   *
   * <code>repeated .furo.Link links = 3;</code>
   */
  furo.LinkOuterClass.LinkOrBuilder getLinksOrBuilder(
      int index);

  /**
   * <pre>
   * Meta for the response
   * </pre>
   *
   * <code>.furo.Meta meta = 2;</code>
   */
  boolean hasMeta();
  /**
   * <pre>
   * Meta for the response
   * </pre>
   *
   * <code>.furo.Meta meta = 2;</code>
   */
  furo.MetaOuterClass.Meta getMeta();
  /**
   * <pre>
   * Meta for the response
   * </pre>
   *
   * <code>.furo.Meta meta = 2;</code>
   */
  furo.MetaOuterClass.MetaOrBuilder getMetaOrBuilder();
}
