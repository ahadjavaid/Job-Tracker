# Backend Skills & Patterns (Java Spring Boot)

## 1. Manual DTO Mapping Pattern
Since we do not use MapStruct, manual mapping should be implemented either as static methods within the DTO or in a dedicated Mapper component.

```java
// Example: User.java (Entity)
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;
}

// Example: UserDto.java (DTO)
@Data
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    
    // Mapping method: Entity to DTO
    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .build();
    }
    
    // Mapping method: DTO to Entity
    public User toEntity() {
        return User.builder()
            .id(this.id)
            .username(this.username)
            .email(this.email)
            // Password not mapped here, usually handled separately in registration/update
            .build();
    }
}
```

## 2. Layered Architecture Example
Keep the controller thin, handle logic in the service.

```java
// Controller Layer
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}

// Service Layer
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDto.fromEntity(user);
    }
}
```

## 3. Global Exception Handling
Handle all exceptions globally so controllers are clean and clients get consistent error formats.

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            System.currentTimeMillis()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
```
