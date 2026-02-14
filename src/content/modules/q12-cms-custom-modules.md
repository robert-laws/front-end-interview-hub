---
id: "q12-cms-custom-modules"
questionNumber: 12
title: "CMS Custom Modules"
question: "How do you approach creating custom modules or plugins for a CMS? Can you give an example of one you built?"
whatItTests: "Your ability to extend CMS platforms beyond their default functionality, understanding of CMS architecture patterns, and experience building maintainable, well-structured plugins or modules."
coreExplanation:
  summary: "Creating custom CMS modules or plugins requires understanding the platform's architecture, hook systems, and API conventions. Whether working with WordPress, Drupal, or another CMS, the core principles remain the same: identify the extension point, follow the platform's patterns, register your functionality cleanly, and ensure the module is testable and maintainable."
  details:
    - heading: "WordPress Plugin Architecture"
      content: "WordPress plugins are PHP files in the wp-content/plugins directory. They use a hook-based architecture with two key mechanisms: actions (do something at a specific point) and filters (modify data before it is used). Every plugin starts with a header comment that WordPress reads to register it. Well-structured plugins use object-oriented patterns, separate concerns into classes, and follow the WordPress Coding Standards."
    - heading: "Hooks, Actions, and Filters"
      content: "Actions let you execute code at specific points in the WordPress lifecycle (e.g., init, wp_enqueue_scripts, save_post). Filters let you intercept and modify data before WordPress uses it (e.g., the_content, the_title, wp_nav_menu_items). The hook system is the backbone of WordPress extensibility and allows plugins to modify behavior without touching core files."
    - heading: "Custom Post Types and Custom Fields"
      content: "One of the most common plugin tasks is registering custom post types and taxonomies. Custom post types extend WordPress beyond posts and pages to handle any content model (events, products, testimonials). Custom fields store additional metadata on posts. Plugins like Advanced Custom Fields simplify field creation, but developers should understand the register_post_type and register_meta APIs."
    - heading: "Gutenberg Block Development"
      content: "The WordPress block editor (Gutenberg) uses React-based blocks. Custom blocks are registered with registerBlockType in JavaScript and require both an edit component (what appears in the editor) and a save component (what is rendered on the front end). Block development uses @wordpress/scripts for build tooling and @wordpress/block-editor for editor-specific components."
    - heading: "Drupal Module Architecture"
      content: "Drupal modules follow a more structured pattern with .info.yml metadata files, routing definitions, controllers, and a service container for dependency injection. Drupal uses an event-driven hook system similar to WordPress but also provides a plugin API for creating swappable, discoverable components. Modules interact with Drupal's entity system to define custom content types, fields, and display modes."
keyConcepts:
  - term: "add_action / add_filter"
    explanation: "The two fundamental WordPress functions for hooking into the system. add_action('hook_name', 'callback', priority, args) runs code at a specific point. add_filter('hook_name', 'callback', priority, args) modifies data and must return a value. Priority controls execution order (default 10, lower runs first)."
  - term: "register_post_type"
    explanation: "WordPress function that creates a custom content type. Accepts a slug and an array of arguments controlling labels, public visibility, REST API support, menu position, supported features (title, editor, thumbnail), and rewrite rules. Should be called on the init action hook."
  - term: "registerBlockType"
    explanation: "The JavaScript function from @wordpress/blocks that registers a custom Gutenberg block. Requires a block name (namespace/block-name), and a configuration object with title, category, icon, attributes, edit component, and save component. The edit function renders the block in the editor, while save renders the front-end output."
  - term: "Shortcodes"
    explanation: "A WordPress feature that lets users insert dynamic content using bracket syntax like [my_shortcode attr='value']. Registered with add_shortcode(), the callback receives attributes and content, returning HTML. While still supported, blocks are the modern replacement for most shortcode use cases."
  - term: "Plugin Activation and Deactivation Hooks"
    explanation: "register_activation_hook and register_deactivation_hook run code when a plugin is activated or deactivated. Common uses include creating custom database tables, setting default options, scheduling cron events on activation, and cleaning up options or scheduled events on deactivation."
  - term: "WordPress REST API"
    explanation: "Plugins can register custom REST API endpoints using register_rest_route. This allows headless CMS architectures where the front end is decoupled from WordPress. Custom endpoints follow the /wp-json/namespace/v1/route pattern and support authentication, permissions callbacks, and schema validation."
  - term: "Nonce Verification"
    explanation: "WordPress nonces (number used once) are security tokens that verify the origin and intent of requests. Plugins must generate nonces with wp_create_nonce or wp_nonce_field and verify them with wp_verify_nonce or check_admin_referer to prevent cross-site request forgery (CSRF) attacks."
  - term: "Drupal Services and Dependency Injection"
    explanation: "Drupal modules define services in a module_name.services.yml file. The service container manages dependencies, making code testable and decoupled. Controllers and plugins receive dependencies through constructor injection rather than calling global functions."
codeExamples:
  - title: "WordPress Action and Filter Hooks"
    language: "php"
    code: |
      <?php
      /**
       * Plugin Name: Custom Portfolio
       * Description: Adds a portfolio custom post type with filtering.
       * Version: 1.0.0
       */

      // Action: Register custom post type on init
      add_action('init', 'portfolio_register_post_type');

      function portfolio_register_post_type() {
          register_post_type('portfolio', [
              'labels' => [
                  'name'          => 'Portfolio',
                  'singular_name' => 'Project',
                  'add_new_item'  => 'Add New Project',
              ],
              'public'       => true,
              'has_archive'  => true,
              'show_in_rest' => true,
              'supports'     => ['title', 'editor', 'thumbnail', 'excerpt'],
              'menu_icon'    => 'dashicons-portfolio',
              'rewrite'      => ['slug' => 'portfolio'],
          ]);
      }

      // Filter: Modify the content output for portfolio posts
      add_filter('the_content', 'portfolio_append_meta');

      function portfolio_append_meta($content) {
          if (get_post_type() !== 'portfolio') {
              return $content;
          }
          $client = get_post_meta(get_the_ID(), '_portfolio_client', true);
          if ($client) {
              $content .= '<p class="portfolio-client">Client: '
                  . esc_html($client) . '</p>';
          }
          return $content;
      }
    description: "A WordPress plugin that registers a portfolio custom post type using an action hook and modifies its content output using a filter hook. The action fires on init to register the post type, while the filter appends client metadata to portfolio post content."
  - title: "Custom Gutenberg Block Registration"
    language: "javascript"
    code: |
      import { registerBlockType } from '@wordpress/blocks';
      import { RichText, useBlockProps, InspectorControls } from '@wordpress/block-editor';
      import { PanelBody, TextControl } from '@wordpress/components';

      registerBlockType('portfolio/testimonial', {
          title: 'Testimonial',
          icon: 'format-quote',
          category: 'widgets',
          attributes: {
              quote: { type: 'string', source: 'html', selector: '.testimonial-quote' },
              author: { type: 'string', default: '' },
              role: { type: 'string', default: '' },
          },
          edit({ attributes, setAttributes }) {
              const blockProps = useBlockProps({ className: 'testimonial-block' });
              return (
                  <div {...blockProps}>
                      <InspectorControls>
                          <PanelBody title="Author Details">
                              <TextControl
                                  label="Author Name"
                                  value={attributes.author}
                                  onChange={(author) => setAttributes({ author })}
                              />
                              <TextControl
                                  label="Role / Company"
                                  value={attributes.role}
                                  onChange={(role) => setAttributes({ role })}
                              />
                          </PanelBody>
                      </InspectorControls>
                      <blockquote>
                          <RichText
                              tagName="p"
                              className="testimonial-quote"
                              placeholder="Enter testimonial..."
                              value={attributes.quote}
                              onChange={(quote) => setAttributes({ quote })}
                          />
                          <footer>
                              <strong>{attributes.author || 'Author Name'}</strong>
                              {attributes.role && <span>, {attributes.role}</span>}
                          </footer>
                      </blockquote>
                  </div>
              );
          },
          save({ attributes }) {
              const blockProps = useBlockProps.save({ className: 'testimonial-block' });
              return (
                  <div {...blockProps}>
                      <blockquote>
                          <RichText.Content
                              tagName="p"
                              className="testimonial-quote"
                              value={attributes.quote}
                          />
                          <footer>
                              <strong>{attributes.author}</strong>
                              {attributes.role && <span>, {attributes.role}</span>}
                          </footer>
                      </blockquote>
                  </div>
              );
          },
      });
    description: "A custom Gutenberg block for displaying testimonials. The edit function renders the block in the editor with a RichText field and sidebar controls for author details. The save function outputs the final HTML for the front end. This follows the standard pattern of separating editor UI from saved output."
  - title: "Custom Post Type with REST API Endpoint"
    language: "php"
    code: |
      <?php
      // Register a custom REST API endpoint for featured projects
      add_action('rest_api_init', function () {
          register_rest_route('portfolio/v1', '/featured', [
              'methods'  => 'GET',
              'callback' => 'portfolio_get_featured',
              'permission_callback' => '__return_true',
          ]);
      });

      function portfolio_get_featured() {
          $query = new WP_Query([
              'post_type'      => 'portfolio',
              'posts_per_page' => 6,
              'meta_key'       => '_portfolio_featured',
              'meta_value'     => '1',
          ]);

          $projects = [];
          foreach ($query->posts as $post) {
              $projects[] = [
                  'id'        => $post->ID,
                  'title'     => $post->post_title,
                  'excerpt'   => get_the_excerpt($post),
                  'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
                  'link'      => get_permalink($post),
                  'client'    => get_post_meta($post->ID, '_portfolio_client', true),
              ];
          }

          return new WP_REST_Response($projects, 200);
      }
    description: "A custom REST API endpoint that returns featured portfolio projects. This enables headless or decoupled front-end architectures where a JavaScript framework fetches CMS content via the API. The permission_callback controls who can access the endpoint."
pitfalls:
  - title: "Not using activation and deactivation hooks properly"
    description: "Failing to clean up database tables, options, or cron jobs on deactivation leaves orphaned data. Always register deactivation hooks that undo what the activation hook set up. For full cleanup, also implement an uninstall.php file."
  - title: "Directly modifying core CMS files"
    description: "Editing core WordPress or Drupal files means your changes will be lost on the next update. Always use the hook and filter system, child themes, or custom plugins to modify behavior. This is the fundamental principle of CMS extensibility."
  - title: "Skipping nonce verification in form handlers"
    description: "Processing form submissions or AJAX requests without verifying nonces opens the plugin to CSRF attacks. Every form should include wp_nonce_field and every handler should call wp_verify_nonce or check_admin_referer before processing data."
  - title: "Not escaping output"
    description: "Outputting user-supplied or database content without escaping creates cross-site scripting (XSS) vulnerabilities. Use esc_html for text content, esc_attr for attributes, esc_url for URLs, and wp_kses for allowing specific HTML tags."
  - title: "Registering too many admin menu items"
    description: "Plugins that add multiple top-level admin menu items clutter the WordPress dashboard. Use a single top-level menu with submenus, or add options pages under the existing Settings menu. Respect the admin UI conventions of the platform."
caseStudies:
  - title: "Custom Event Management Plugin"
    scenario: "A nonprofit organization needed an event management system within their existing WordPress site. Off-the-shelf plugins were either too complex or lacked specific features like volunteer signup tracking and automated reminder emails."
    approach: "Built a custom plugin with an 'event' custom post type, custom taxonomies for event categories and locations, and meta boxes for dates, capacity, and volunteer slots. Used the WordPress cron API for automated email reminders and the REST API for a React-based event calendar on the front end."
    outcome: "The plugin handled over 200 events per year with integrated volunteer management. The REST API approach allowed the front-end calendar to update dynamically without page reloads. Maintenance was straightforward because the plugin followed WordPress conventions and had unit tests for the core logic."
  - title: "Drupal Commerce Integration Module"
    scenario: "An e-commerce site on Drupal needed a custom module to integrate with a proprietary inventory management API that no existing module supported."
    approach: "Created a Drupal module that defined a custom service for API communication, used Drupal's queue system for batch inventory syncing, and implemented a custom field formatter to display real-time stock levels on product pages. The module used dependency injection for the HTTP client and configuration management for API credentials."
    outcome: "Inventory data stayed synchronized within a five-minute window. The queue-based approach prevented API rate limiting issues. The service-oriented architecture made it straightforward to write PHPUnit tests by mocking the HTTP client."
furtherReading:
  - title: "WordPress Plugin Handbook"
    url: "https://developer.wordpress.org/plugins/"
  - title: "WordPress Block Editor Handbook"
    url: "https://developer.wordpress.org/block-editor/"
  - title: "Drupal Module Development Guide"
    url: "https://www.drupal.org/docs/creating-modules"
  - title: "WordPress REST API Handbook"
    url: "https://developer.wordpress.org/rest-api/"
  - title: "WordPress Coding Standards"
    url: "https://developer.wordpress.org/coding-standards/"
---

## Understanding CMS Extension Points

Building custom modules for a CMS is fundamentally about understanding how the platform was designed to be extended. Every mature CMS provides deliberate extension points, whether they are called hooks, events, plugins, or modules. The key is working with the system rather than around it. When you use the platform's native APIs and conventions, your custom code benefits from automatic upgrades, compatibility with other plugins, and a familiar structure for other developers on the team.

## The Hook System Mental Model

WordPress's hook system is the most widely encountered pattern in CMS development. Think of hooks as named events broadcast throughout the request lifecycle. When WordPress processes a page request, it fires dozens of actions in sequence: plugins_loaded, init, template_redirect, wp_head, the_content, and wp_footer are just a few. Your plugin registers callbacks on these hooks to inject its functionality at precisely the right moment. Filters work the same way but pass data through a chain of callbacks, each one receiving the output of the previous. This pattern creates a loosely coupled architecture where plugins can coexist without directly knowing about each other.

## Modern Block Development

The Gutenberg block editor has shifted WordPress plugin development significantly toward JavaScript. Custom blocks are essentially React components that integrate with the editor's data layer. Each block defines its own attributes (the data model), an edit component (the editor experience), and a save function (the serialized output). This is a departure from the older shortcode model where everything was processed on the server. Block development requires familiarity with JSX, the @wordpress/scripts build pipeline, and the block.json metadata format that was introduced to standardize block registration.

## Testing and Maintenance

A well-built CMS plugin is testable. WordPress provides WP_UnitTestCase for integration testing, and PHPUnit handles unit tests for isolated logic. For Gutenberg blocks, Jest and the @wordpress/test-utils package enable component-level testing. Beyond automated tests, follow semantic versioning for your plugin releases, maintain a changelog, and test against multiple PHP and WordPress versions using CI tools. Plugins that lack tests become liabilities as the CMS platform evolves, because core updates can introduce subtle incompatibilities that only surface in production.
