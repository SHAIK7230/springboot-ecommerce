package com.ecommerce.project.security;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.RoleRepository;
import com.ecommerce.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ecommerce.project.security.jwt.AuthEntryPointJwt;
import com.ecommerce.project.security.jwt.AuthTokenFilter;
import com.ecommerce.project.security.services.UserDetailsServiceImpl;

import java.util.Set;

@Configuration
@EnableWebSecurity
//@EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);

//        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/v3/api-docs/**").permitAll()
                                .requestMatchers("/h2-console/**").permitAll()
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/seller/**").hasAnyRole("ADMIN","SELLER")
                                //.requestMatchers("/api/admin/**").permitAll()
                                .requestMatchers("/api/public/**").permitAll()
                                .requestMatchers("/swagger-ui/**").permitAll()
                                .requestMatchers("/api/test/**").permitAll()
                                .requestMatchers("/images/**").permitAll()
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        http.headers(headers -> headers.frameOptions(
                frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web -> web.ignoring().requestMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**"));
    }


    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository,
                                     UserRepository userRepository,
                                     CategoryRepository categoryRepository,
                                     ProductRepository productRepository,
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            // Retrieve or create roles
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> {
                        Role newUserRole = new Role(AppRole.ROLE_USER);
                        return roleRepository.save(newUserRole);
                    });

            Role sellerRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                    .orElseGet(() -> {
                        Role newSellerRole = new Role(AppRole.ROLE_SELLER);
                        return roleRepository.save(newSellerRole);
                    });

            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> {
                        Role newAdminRole = new Role(AppRole.ROLE_ADMIN);
                        return roleRepository.save(newAdminRole);
                    });

            Set<Role> userRoles = Set.of(userRole);
            Set<Role> sellerRoles = Set.of(sellerRole);
            Set<Role> adminRoles = Set.of(userRole, sellerRole, adminRole);


            // Create users if not already present
            if (!userRepository.existsByUserName("user1")) {
                User user1 = new User("user1", "user1@example.com", passwordEncoder.encode("password1"));
                userRepository.save(user1);
            }

            if (!userRepository.existsByUserName("seller1")) {
                User seller1 = new User("seller1", "seller1@example.com", passwordEncoder.encode("password2"));
                userRepository.save(seller1);
            }

            if (!userRepository.existsByUserName("admin")) {
                User admin = new User("admin", "admin@example.com", passwordEncoder.encode("adminPass"));
                userRepository.save(admin);
            }

            // Update roles for existing users
            userRepository.findByUserName("user1").ifPresent(user -> {
                user.setRoles(userRoles);
                userRepository.save(user);
            });

            userRepository.findByUserName("seller1").ifPresent(seller -> {
                seller.setRoles(sellerRoles);
                userRepository.save(seller);
            });

            userRepository.findByUserName("admin").ifPresent(admin -> {
                admin.setRoles(adminRoles);
                userRepository.save(admin);
            });

            // Seed Sample Categories and Products for Demo
            if (categoryRepository.count() == 0 || productRepository.count() == 0) {
                Category electronics = categoryRepository.findByCategoryName("Electronics");
                if (electronics == null) {
                    electronics = new Category();
                    electronics.setCategoryName("Electronics");
                    electronics = categoryRepository.save(electronics);
                }

                Category fashion = categoryRepository.findByCategoryName("Fashion");
                if (fashion == null) {
                    fashion = new Category();
                    fashion.setCategoryName("Fashion");
                    fashion = categoryRepository.save(fashion);
                }

                Category home = categoryRepository.findByCategoryName("Home & Living");
                if (home == null) {
                    home = new Category();
                    home.setCategoryName("Home & Living");
                    home = categoryRepository.save(home);
                }

                User seller = userRepository.findByUserName("seller1").orElse(null);

                productRepository.deleteAll();

                Product p1 = new Product();
                p1.setProductName("Wireless Noise-Canceling Headphones");
                p1.setDescription("Premium wireless over-ear headphones with active noise cancellation and 30-hour battery life.");
                p1.setQuantity(20);
                p1.setPrice(4999.0);
                p1.setDiscount(15.0);
                p1.setSpecialPrice(4249.0);
                p1.setImage("headphones.jpg");
                p1.setCategory(electronics);
                p1.setUser(seller);
                productRepository.save(p1);

                Product p2 = new Product();
                p2.setProductName("Smart Fitness Watch");
                p2.setDescription("Water-resistant fitness tracker with heart rate monitor, GPS, and vibrant AMOLED display.");
                p2.setQuantity(35);
                p2.setPrice(2999.0);
                p2.setDiscount(10.0);
                p2.setSpecialPrice(2699.0);
                p2.setImage("smartwatch.jpg");
                p2.setCategory(electronics);
                p2.setUser(seller);
                productRepository.save(p2);

                Product p3 = new Product();
                p3.setProductName("Ultra-Slim Pro Laptop");
                p3.setDescription("Fast and lightweight 14-inch laptop with Intel Core processor, 16GB RAM, and 512GB SSD.");
                p3.setQuantity(10);
                p3.setPrice(54999.0);
                p3.setDiscount(10.0);
                p3.setSpecialPrice(49499.0);
                p3.setImage("laptop.jpg");
                p3.setCategory(electronics);
                p3.setUser(seller);
                productRepository.save(p3);

                Product p4 = new Product();
                p4.setProductName("4K Mirrorless Digital Camera");
                p4.setDescription("Professional 24MP digital camera with 4K video recording, dual stabilization, and Wi-Fi.");
                p4.setQuantity(8);
                p4.setPrice(42999.0);
                p4.setDiscount(12.0);
                p4.setSpecialPrice(37839.0);
                p4.setImage("camera.jpg");
                p4.setCategory(electronics);
                p4.setUser(seller);
                productRepository.save(p4);

                Product p5 = new Product();
                p5.setProductName("Classic Denim Jacket");
                p5.setDescription("Durable, stylish blue denim trucker jacket with comfortable regular fit.");
                p5.setQuantity(15);
                p5.setPrice(1899.0);
                p5.setDiscount(20.0);
                p5.setSpecialPrice(1519.0);
                p5.setImage("denim_jacket.jpg");
                p5.setCategory(fashion);
                p5.setUser(seller);
                productRepository.save(p5);

                Product p6 = new Product();
                p6.setProductName("Athletic Running Shoes");
                p6.setDescription("Breathable, lightweight cushioned running sneakers engineered for peak comfort and endurance.");
                p6.setQuantity(25);
                p6.setPrice(3499.0);
                p6.setDiscount(15.0);
                p6.setSpecialPrice(2974.0);
                p6.setImage("running_shoes.jpg");
                p6.setCategory(fashion);
                p6.setUser(seller);
                productRepository.save(p6);

                Product p7 = new Product();
                p7.setProductName("Ergonomic Mesh Office Chair");
                p7.setDescription("Breathable mesh desk chair with adjustable lumbar support, headrest, and 3D armrests.");
                p7.setQuantity(12);
                p7.setPrice(8499.0);
                p7.setDiscount(10.0);
                p7.setSpecialPrice(7649.0);
                p7.setImage("office_chair.jpg");
                p7.setCategory(home);
                p7.setUser(seller);
                productRepository.save(p7);

                Product p8 = new Product();
                p8.setProductName("Modern Travel Backpack");
                p8.setDescription("Water-resistant laptop travel backpack with USB charging port and anti-theft compartments.");
                p8.setQuantity(30);
                p8.setPrice(1499.0);
                p8.setDiscount(25.0);
                p8.setSpecialPrice(1124.0);
                p8.setImage("backpack.jpg");
                p8.setCategory(fashion);
                p8.setUser(seller);
                productRepository.save(p8);
            }
        };
    }

}